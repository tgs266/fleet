package oidc

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/gofiber/fiber/v2"
	"golang.org/x/oauth2"
)

type OIDCManager struct {
	oauth2Config oauth2.Config
	verifier     *oidc.IDTokenVerifier
}

func randString(nByte int) (string, error) {
	b := make([]byte, nByte)
	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return "", err
	}
	return base64.RawURLEncoding.EncodeToString(b), nil
}

func (manager *OIDCManager) Init(config OIDCConfig) error {
	provider, err := oidc.NewProvider(context.TODO(), config.IssuerURL)
	if err != nil {
		return err
	}
	scopes := []string{oidc.ScopeOpenID, "profile", "email"}
	if config.UseOfflineAccess {
		scopes = append(scopes, oidc.ScopeOfflineAccess)
	}
	oauth2Config := oauth2.Config{
		ClientID:     config.ClientID,
		ClientSecret: config.ClientSecret,
		RedirectURL:  config.Host + "/api/v1/auth/oauth2/callback",

		Endpoint: provider.Endpoint(),

		Scopes: scopes,
	}

	manager.oauth2Config = oauth2Config
	manager.verifier = provider.Verifier(&oidc.Config{
		ClientID: config.ClientID,
	})

	return nil
}

func (manager *OIDCManager) GetOIDCUrl(c *fiber.Ctx) string {
	state, _ := randString(16)
	nonce, _ := randString(16)

	c.Cookie(&fiber.Cookie{
		Name:     "location",
		Value:    c.Query("location"),
		MaxAge:   int(time.Hour.Seconds()),
		HTTPOnly: true,
	})

	c.Cookie(&fiber.Cookie{
		Name:     "state",
		Value:    state,
		MaxAge:   int(time.Hour.Seconds()),
		HTTPOnly: true,
	})

	c.Cookie(&fiber.Cookie{
		Name:     "nonce",
		Value:    nonce,
		MaxAge:   int(time.Hour.Seconds()),
		HTTPOnly: true,
	})

	url := manager.oauth2Config.AuthCodeURL(state, oidc.Nonce(nonce))
	fmt.Println(url)

	return url
}

func (manager *OIDCManager) Callback(c *fiber.Ctx) (string, error) {

	state := c.Cookies("state", "")
	if state == "" {
		return "", errors.New("oidc state failure")
	}

	nonce := c.Cookies("nonce", "")
	if nonce == "" {
		return "", errors.New("oidc nonce failure")
	}

	queryState := c.Query("state", "")

	if queryState != state {
		return "", errors.New("oidc states dont match")
	}

	oauth2Token, err := manager.oauth2Config.Exchange(context.TODO(), c.Query("code"))
	if err != nil {
		return "", err
	}

	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		return "", errors.New("no id_token field in oauth2 token")
	}

	_, err = manager.verifier.Verify(context.TODO(), rawIDToken)
	if err != nil {
		return "", errors.New("failed to verify ID Token: " + err.Error())
	}

	return rawIDToken, nil
}

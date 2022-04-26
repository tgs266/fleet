package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/oauth2-proxy/mockoidc"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/auth"
	"github.com/tgs266/fleet/lib/auth/oidc"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/logging"
)

func IsOIDCAvailableFail(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()

	logging.Init(logging.LVL_INFO)

	manager := client.NewClientManager(true)
	manager.TestMode = true
	manager.InitializeOIDC(oidc.OIDCConfig{
		IssuerURL:    m.Issuer(),
		ClientID:     m.ClientID,
		ClientSecret: m.ClientSecret,
	})

	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})

	AddUnsupportedOIDCRoute(app)

	req := httptest.NewRequest("GET", "/api/v1/auth/oauth2/", nil)

	app.Test(req)
}

func IsOIDCAvailable(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()

	logging.Init(logging.LVL_INFO)

	manager := client.NewClientManager(true)
	manager.TestMode = true
	manager.InitializeOIDC(oidc.OIDCConfig{
		IssuerURL:    m.Issuer(),
		ClientID:     m.ClientID,
		ClientSecret: m.ClientSecret,
	})

	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})

	AddOIDCRoutes(app)

	req := httptest.NewRequest("GET", "/api/v1/auth/oauth2/", nil)

	app.Test(req)
}

func TestGetOIDCUrl(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()

	logging.Init(logging.LVL_INFO)

	manager := client.NewClientManager(true)
	manager.TestMode = true
	manager.InitializeOIDC(oidc.OIDCConfig{
		IssuerURL:    m.Issuer(),
		ClientID:     m.ClientID,
		ClientSecret: m.ClientSecret,
	})

	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})

	AddOIDCRoutes(app)

	req := httptest.NewRequest("GET", "/api/v1/auth/oauth2/url", nil)

	app.Test(req)
}

func TestLogin(t *testing.T) {
	app := setupAppAuth()

	app.Post("/api/v1/auth/login", Login)

	data := &auth.LoginRequest{
		Token: "asdfasdfasdfasf",
	}

	db, _ := json.Marshal(data)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(db))

	app.Test(req)
}

package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/auth"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	v1 "k8s.io/api/authorization/v1"
)

func CanI(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	name := c.Query("name")
	namespace := c.Query("namespace")
	verb := c.Query("verb")
	resource := c.Query("resource")

	response, err := K8.K8.AuthorizationV1().SelfSubjectAccessReviews().Create(context.TODO(), &v1.SelfSubjectAccessReview{
		Spec: v1.SelfSubjectAccessReviewSpec{
			ResourceAttributes: &v1.ResourceAttributes{
				Namespace: namespace,
				Name:      name,
				Resource:  fmt.Sprintf("%ss", strings.ToLower(resource)),
				Verb:      strings.ToLower(verb),
			},
		},
	}, metaV1.CreateOptions{})

	if err != nil {
		return errors.ParseInternalError(err)
	}
	resp := struct {
		Allowed bool `json:"allowed"`
	}{
		Allowed: response.Status.Allowed,
	}

	return c.JSON(resp)
}

func UsingAuth(c *fiber.Ctx, client *client.ClientManager) error {
	return c.JSON(struct {
		UsingAuth bool `json:"usingAuth"`
	}{
		UsingAuth: client.UseAuth,
	})
}

func Login(c *fiber.Ctx, client *client.ClientManager) error {
	body := new(auth.LoginRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		return err
	}

	resp, err := client.Authenticate(c, *body)
	if err != nil {
		return err
	}
	return c.JSON(resp)
}

func Refresh(c *fiber.Ctx, client *client.ClientManager) error {
	body := new(auth.RefreshRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		return err
	}

	resp, err := client.RefreshToken(*body)
	if err != nil {
		return err
	}
	return c.JSON(resp)
}

func AddOIDCRoutes(app *api.API) {
	app.Get("/api/v1/auth/oauth2", func(c *fiber.Ctx, clientManager *client.ClientManager) error {
		response := struct {
			Available bool `json:"available"`
		}{
			Available: true,
		}
		return c.JSON(response)
	})
	app.Get("/api/v1/auth/oauth2/url", func(c *fiber.Ctx, clientManager *client.ClientManager) error {
		url := clientManager.OIDCUrl(c)
		resp := struct {
			URL string `json:"url"`
		}{
			URL: url,
		}

		return c.JSON(
			resp,
		)
	})
	app.Get("/api/v1/auth/oauth2/callback", func(c *fiber.Ctx, clientManager *client.ClientManager) error {
		idToken, err := clientManager.OIDCCallback(c)
		if err != nil {
			return err
		}

		jwe, err := clientManager.Encode(idToken)
		if err != nil {
			return err
		}

		c.Cookie(&fiber.Cookie{
			Name:     "token",
			Value:    jwe.Token,
			MaxAge:   int(time.Hour.Seconds()),
			HTTPOnly: false,
		})

		return c.Redirect(c.Cookies("location"))
	})
}

func AddUnsupportedOIDCRoute(app *api.API) {
	app.Get("/api/v1/auth/oauth2", func(c *fiber.Ctx, clientManager *client.ClientManager) error {
		response := struct {
			Available bool `json:"available"`
		}{
			Available: false,
		}
		return c.JSON(response)
	})
}

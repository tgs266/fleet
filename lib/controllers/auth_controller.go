package controllers

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/auth"
	"github.com/tgs266/fleet/lib/client"
)

func Login(c *fiber.Ctx, client *client.ClientManager) error {
	body := new(auth.LoginRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		fmt.Println(err)
		return err
	}

	resp, err := client.Authenticate(*body)
	if err != nil {
		return err
	}
	return c.JSON(resp)
}

func Refresh(c *fiber.Ctx, client *client.ClientManager) error {
	body := new(auth.RefreshRequest)

	if err := c.BodyParser(body); err != nil {
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
		return c.JSON(clientManager.OIDCUrl(c))
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

package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
)

func setupApp() *api.API {
	manager := &client.ClientManager{
		TestMode: true,
	}
	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})
	return app
}

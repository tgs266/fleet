package controllers

import (
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/logging"
)

func setupApp() *api.API {
	logging.Init(logging.LVL_INFO)
	manager := client.NewClientManager(false, "")
	manager.TestMode = true
	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})
	return app
}

func setupAppAuth() *api.API {
	logging.Init(logging.LVL_INFO)
	manager := client.NewClientManager(true, "")
	manager.TestMode = false
	manager.TestAuthMode = true
	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})
	return app
}

func TestInitializeRotue(t *testing.T) {
	app := setupApp()
	InitializeRoutes(app)
}

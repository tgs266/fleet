package main

import (
	"flag"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/controllers"
	"github.com/tgs266/fleet/lib/fleet"
	"github.com/tgs266/fleet/lib/logging"
)

func createFiberConfig() fiber.Config {
	return fiber.Config{
		DisableStartupMessage: true,
		// ErrorHandler:          errors.FiberErrorHandler,
	}
}

func main() {

	logging.Init(logging.LVL_INFO)
	logging.INFO("initializing fleet")

	src := flag.String("src", "", "frontend source")

	flag.Parse()

	manager := client.NewClientManager()
	app := api.New(manager, createFiberConfig())
	logging.INFO("api created")

	app.RegisterMiddleware(cors.New())
	app.RegisterMiddleware(recover.New())

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	logging.INFO("middleware registered")

	logging.INFO("initializing routing")
	controllers.InitializeRoutes(app)

	logging.INFO("routing initialization completed")
	logging.INFO("initializing fleet routes")

	fleet.AddRoutes(app)

	logging.INFO("fleet routes initialization complete")

	if src != nil {
		logging.INFO("serving frontend")
		path := *src
		logging.INFO(path)
		app.Static("/", path)
	}

	app.Listen(":9095")
}

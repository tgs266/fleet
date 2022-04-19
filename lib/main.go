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
	app.Get("/api/v1/pods/:namespace", controllers.GetPodMetaList)
	app.Get("/api/v1/pods/:namespace/:name", controllers.GetPod)
	app.Delete("/api/v1/pods/:namespace/:name", controllers.DeletePod)
	app.Get("/api/v1/pods/:namespace/:podName/containers/:containerName", controllers.GetPodContainer)
	app.WebsocketGet("/ws/v1/pods/:namespace/:podName/containers/:containerName/logs", controllers.ContainerLogStream)
	app.WebsocketGet("/ws/v1/pods/:namespace/:name/events", controllers.PodEventStream)

	app.Post("/api/v1/deployments/", controllers.CreateDeployment)
	app.Get("/api/v1/deployments/:namespace", controllers.GetDeploymentStubList)
	app.Get("/api/v1/deployments/:namespace/:name", controllers.GetDeployment)
	app.Delete("/api/v1/deployments/:namespace/:name", controllers.DeleteDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/scale", controllers.ScaleDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/restart", controllers.RestartDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/container-specs/:specName", controllers.UpdateDeploymentContainerSpec)
	app.WebsocketGet("/ws/v1/deployments/:namespace/:name/events", controllers.DeploymentEventStream)

	app.Get("/api/v1/nodes", controllers.GetNodes)
	app.Get("/api/v1/nodes/:name", controllers.GetNode)

	app.Get("/api/v1/services/:namespace/", controllers.GetServices)
	app.Get("/api/v1/services/:namespace/:name", controllers.GetService)

	app.Get("/api/v1/images", controllers.GetAllImages)

	app.Get("/api/v1/system/resources", controllers.GetSystemResources)

	app.Get("/api/v1/namespaces/", controllers.GetNamespaces)
	app.Get("/api/v1/namespaces/:name", controllers.GetNamespace)

	app.Get("/api/v1/raw/:kind/:namespace/:name", controllers.RawGet)
	app.Get("/api/v1/raw/:kind/:name", controllers.RawGet)

	app.Put("/api/v1/raw/:kind/:namespace/:name", controllers.RawPut)
	app.Put("/api/v1/raw/:kind/:name", controllers.RawPut)

	app.Get("/api/v1/filters/properties", controllers.GetFilters)

	logging.INFO("routing initialization completed")
	logging.INFO("initializing fleet routes")

	fleet.AddRoutes(app)

	logging.INFO("fleet routes initialization complete")

	if src != nil {
		logging.INFO("serving frontend")
		// ex, _ := os.Executable()
		// exPath := filepath.Dir(ex)
		// path := filepath.Join(exPath, *src)
		path := *src
		logging.INFO(path)
		app.Static("/", path)
	}

	app.Listen(":9095")
}

package api

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/logging"
)

type API struct {
	clientManager *client.ClientManager

	app *fiber.App
}

type Method int

const (
	GET  Method = 0
	POST        = 1
	PUT         = 2
)

func (api *API) RegisterMiddleware(function func(c *fiber.Ctx) error) {
	api.app.Use(function)
}

func (api *API) Static(prefix string, root string) {
	api.app.Static(prefix, root)
}
func (api *API) Get(path string, handler func(c *fiber.Ctx, clientManager *client.ClientManager) error) {
	api.app.Get(path, func(c *fiber.Ctx) error {
		return handler(c, api.clientManager)
	})
}

func (api *API) Put(path string, handler func(c *fiber.Ctx, clientManager *client.ClientManager) error) {
	api.app.Put(path, func(c *fiber.Ctx) error {
		return handler(c, api.clientManager)
	})
}

func (api *API) Post(path string, handler func(c *fiber.Ctx, clientManager *client.ClientManager) error) {
	api.app.Post(path, func(c *fiber.Ctx) error {
		return handler(c, api.clientManager)
	})
}

func (api *API) Delete(path string, handler func(c *fiber.Ctx, clientManager *client.ClientManager) error) {
	api.app.Delete(path, func(c *fiber.Ctx) error {
		return handler(c, api.clientManager)
	})
}

func (api *API) WebsocketGet(path string, handler func(c *websocket.Conn, clientManager *client.ClientManager)) {
	api.app.Get(path, websocket.New(func(c *websocket.Conn) {
		handler(c, api.clientManager)
	}))
}

func (api *API) WebsocketPost(path string, handler func(c *websocket.Conn, clientManager *client.ClientManager)) {
	api.app.Post(path, websocket.New(func(c *websocket.Conn) {
		handler(c, api.clientManager)
	}))
}

func (api *API) Use(args ...interface{}) {
	api.app.Use(args...)
}

func (api *API) Listen(host string) {
	logging.INFO("system initialization complete")
	api.app.Listen(host)
}

func New(client *client.ClientManager, config fiber.Config) *API {
	return &API{
		clientManager: client,
		app:           fiber.New(config),
	}
}

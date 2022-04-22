package api

import (
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/client"
)

func TestAppCreation(t *testing.T) {
	cm := &client.ClientManager{}
	api := New(cm, fiber.Config{
		DisableStartupMessage: true,
	})
	assert.Equal(t, true, api.app.Config().DisableStartupMessage)
}

func TestAppRoutes(t *testing.T) {
	cm := &client.ClientManager{}
	api := New(cm, fiber.Config{
		DisableStartupMessage: true,
	})
	api.Get("asdf", func(c *fiber.Ctx, clientManager *client.ClientManager) error { return nil })
	api.Post("asdf", func(c *fiber.Ctx, clientManager *client.ClientManager) error { return nil })
	api.Put("asdf", func(c *fiber.Ctx, clientManager *client.ClientManager) error { return nil })
	api.Delete("asdf", func(c *fiber.Ctx, clientManager *client.ClientManager) error { return nil })
	api.Static("asdf", "")
}

func TestAppWebsocket(t *testing.T) {
	cm := &client.ClientManager{}
	api := New(cm, fiber.Config{
		DisableStartupMessage: true,
	})
	api.WebsocketGet("asdf", func(c *websocket.Conn, clientManager *client.ClientManager) {})
	api.WebsocketPost("asdf", func(c *websocket.Conn, clientManager *client.ClientManager) {})
}

func TestRegister(t *testing.T) {
	cm := &client.ClientManager{}
	api := New(cm, fiber.Config{
		DisableStartupMessage: true,
	})
	api.RegisterMiddleware(func(c *fiber.Ctx) error { return nil })
}

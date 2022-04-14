package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

func GetFilters(c *fiber.Ctx, client *client.ClientManager) error {
	return c.Status(fiber.StatusOK).JSON(types.AllProperties)
}

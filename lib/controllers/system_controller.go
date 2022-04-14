package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/kubernetes/system"
)

func GetSystemResources(ctx *fiber.Ctx, client *client.ClientManager) error {
	return ctx.Status(fiber.StatusOK).JSON(system.GetSystemResources())
}

package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
)

func GetCurrentClusterName(c *fiber.Ctx, client *client.ClientManager) error {
	_, err := client.Client(c)
	if err != nil {
		return err
	}
	name, err := client.GetClusterName()
	if err != nil {
		return err
	}
	return c.Status(200).JSON(name)
}

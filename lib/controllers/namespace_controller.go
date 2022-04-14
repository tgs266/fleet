package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/kubernetes/resources/namespace"
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

func GetNamespaces(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	dataSelector := types.BuildDataRequest(c).BuildDataSelector()

	data, err := namespace.List(K8, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(data)
}

func GetNamespace(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	name := c.Params("name")

	ns, err := namespace.Get(K8, name)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(ns)
}

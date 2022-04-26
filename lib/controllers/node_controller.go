package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/kubernetes/resources/node"
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

func GetNodes(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	nodes, err := node.List(K8)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(nodes)
}

func GetNode(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}
	name := c.Params("name")

	selector := types.BuildDataRequest(c).BuildDataSelector()

	node, err := node.Get(K8, name, selector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(node)
}

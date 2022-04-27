package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/resources/clusterrole"
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

func GetClusterRoles(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	accounts, err := clusterrole.List(K8, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(accounts)
}

func GetClusterRole(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	name := c.Params("name")

	sa, err := clusterrole.Get(K8, name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(sa)
}

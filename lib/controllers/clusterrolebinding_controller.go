package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/resources/clusterrolebinding"
	"github.com/tgs266/fleet/lib/types"
)

func GetClusterRoleBindings(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	accounts, err := clusterrolebinding.List(K8, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(accounts)
}

func GetClusterRoleBinding(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	name := c.Params("name")

	sa, err := clusterrolebinding.Get(K8, name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(sa)
}

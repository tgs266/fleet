package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/resources/role"
	"github.com/tgs266/fleet/lib/shared"
	"github.com/tgs266/fleet/lib/types"
)

func GetRoles(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	accounts, err := role.List(K8, namespace, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(accounts)
}

func GetRole(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	sa, err := role.Get(K8, namespace, name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(sa)
}

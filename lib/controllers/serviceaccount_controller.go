package controllers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/resources/serviceaccount"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/shared"
)

func GetServiceAccounts(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	accounts, err := serviceaccount.List(K8, namespace, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(accounts)
}

func GetServiceAccount(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	sa, err := serviceaccount.Get(K8, namespace, name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(sa)
}

func ConnectToRoleBinding(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	body := new(serviceaccount.BindRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		return err
	}

	err = serviceaccount.ConnectToRoleBinding(K8, namespace, name, *body)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(fiber.StatusCreated)
}

func ConnectToClusterRoleBinding(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	body := new(serviceaccount.BindRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		return err
	}

	err = serviceaccount.ConnectToClusterRoleBinding(K8, namespace, name, *body)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(fiber.StatusCreated)
}

func DisconnectRoleBinding(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	body := new(serviceaccount.BindRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		return err
	}

	err = serviceaccount.DisconnectRoleBinding(K8, namespace, name, *body)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(fiber.StatusCreated)
}

func DisconnectClusterRoleBinding(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	body := new(serviceaccount.BindRequest)

	if err := json.Unmarshal(c.Body(), &body); err != nil {
		return err
	}

	err = serviceaccount.DisconnectClusterRoleBinding(K8, namespace, name, *body)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(fiber.StatusCreated)
}

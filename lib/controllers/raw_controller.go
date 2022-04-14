package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"k8s.io/apimachinery/pkg/runtime"
)

func RawGet(c *fiber.Ctx, client *client.ClientManager) error {
	rawClient, err := client.RawClient()
	if err != nil {
		return errors.ParseInternalError(err)
	}

	kind := c.Params("kind")
	name := c.Params("name")
	namespace := c.Params("namespace")

	v, err := rawClient.Get(kind, name, namespace)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(v)
}

func RawPut(c *fiber.Ctx, client *client.ClientManager) error {
	rawClient, err := client.RawClient()
	if err != nil {
		return errors.ParseInternalError(err)
	}

	kind := c.Params("kind")
	name := c.Params("name")
	namespace := c.Params("namespace")

	body := new(runtime.Unknown)

	if err := c.BodyParser(body); err != nil {
		return errors.ParseInternalError(err)
	}

	err = rawClient.Put(kind, name, namespace, body)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(fiber.StatusNoContent)
}

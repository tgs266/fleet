package controllers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	"github.com/tgs266/fleet/lib/shared"
)

func GetPodContainer(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	podName := c.Params("podName")
	containerName := c.Params("containerName")

	container, err := container.GetPodContainer(K8, namespace, podName, containerName)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(container)
}

func ContainerLogStream(c *websocket.Conn, client *client.ClientManager) {
	err := c.Locals("k8err")
	if err != nil {
		bytes, _ := json.Marshal(err.(*errors.FleetError))
		c.WriteMessage(8, bytes)
		c.Close()
		return
	}
	K8 := c.Locals("k8").(*kubernetes.K8Client)

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("podName")
	cName := c.Params("containerName")

	container.StreamPodContainerLogs(K8, namespace, name, cName, c)
}

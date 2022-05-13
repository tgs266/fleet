package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/shared"
)

func GetPodMetaList(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	// K8.K8.Rest

	namespace := shared.GetNamespace(c.Params("namespace"))

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	pods, err := pod.ListStubs(K8, namespace, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(pods)
}

func GetPod(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	pod, err := pod.Get(K8, namespace, name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(fiber.StatusOK).JSON(pod)
}

func DeletePod(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	err = pod.Delete(K8, namespace, name)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

func PodEventStream(c *websocket.Conn, client *client.ClientManager) {
	err := c.Locals("k8err")
	if err != nil {
		bytes, _ := json.Marshal(err.(*errors.FleetError))
		c.WriteMessage(8, bytes)
		c.Close()
		return
	}
	K8 := c.Locals("k8").(*kubernetes.K8Client)

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")
	pollInterval, _ := strconv.Atoi(c.Query("pollInterval", "5000"))

	pod.StreamPodEvents(K8, namespace, name, c, pollInterval)
}

func PodExec(c *websocket.Conn, client *client.ClientManager) {
	err := c.Locals("k8err")
	if err != nil {
		bytes, _ := json.Marshal(err.(*errors.FleetError))
		c.WriteMessage(8, bytes)
		c.Close()
		return
	}
	K8 := c.Locals("k8").(*kubernetes.K8Client)

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")
	containerName := c.Params("containerName")

	pod.StreamPodTerminal(K8, namespace, name, containerName, c)
}

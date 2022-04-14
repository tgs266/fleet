package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/shared"
)

func GetPodMetaList(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	pods, err := pod.ListStubs(K8, namespace, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(pods)
}

func GetPod(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
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
	K8, err := client.Client()
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
	K8, err := client.Client()
	if err != nil {
		panic(err)
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")
	pollInterval, _ := strconv.Atoi(c.Query("pollInterval", "5000"))

	pod.StreamPodEvents(K8, namespace, name, c, pollInterval)
}

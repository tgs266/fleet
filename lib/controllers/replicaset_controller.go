package controllers

import (
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/replicaset"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/shared"
)

func GetReplicaSets(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))

	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	pods, err := replicaset.List(K8, namespace, dataSelector)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(pods)
}

func GetReplicaSet(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	dep, err := replicaset.Get(K8, namespace, name)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(dep)
}

func RestartReplicaSet(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	err = replicaset.Restart(K8, namespace, name)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

func ReplicaSetEventStream(c *websocket.Conn, client *client.ClientManager) {
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

	replicaset.StreamReplicaSetEvents(K8, namespace, name, c, pollInterval)
}
package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	"github.com/tgs266/fleet/lib/kubernetes/resources/deployment"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/shared"
)

func GetDeploymentStubList(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	dataSelector := types.BuildDataRequest(c).BuildDataSelector().AddIgnoreSystemNamespace()

	deps, err := deployment.ListMetas(K8, namespace, dataSelector)
	if err != nil {
		panic(err)
	}
	return c.Status(fiber.StatusOK).JSON(deps)
}

func GetDeployment(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	dep, err := deployment.Get(K8, namespace, name)
	if err != nil {
		return err
	}
	return c.Status(fiber.StatusOK).JSON(dep)
}

func RestartDeployment(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	err = deployment.Restart(K8, namespace, name)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

func DeleteDeployment(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	err = deployment.Delete(K8, namespace, name)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

func UpdateDeploymentContainerSpec(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")
	specName := c.Params("specName")

	body := new(container.ContainerSpec)

	if err := c.BodyParser(body); err != nil {
		panic(err)
	}

	err = deployment.UpdateContainerSpec(K8, namespace, name, specName, *body)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusOK)
}

func CreateDeployment(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	body := new(deployment.DeploymentCreation)

	if err := c.BodyParser(body); err != nil {
		return err
	}

	err = deployment.CreateDeployment(K8, *body)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusCreated)
}

func DeploymentEventStream(c *websocket.Conn, client *client.ClientManager) {
	K8, err := client.Client()
	if err != nil {
		panic(err)
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")
	pollInterval, _ := strconv.Atoi(c.Query("pollInterval", "5000"))

	deployment.StreamDeploymentEvents(K8, namespace, name, c, pollInterval)
}

type scaleDeploymentBody struct {
	Replicas int `json:"replicas"`
}

func ScaleDeployment(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		panic(err)
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")
	body := new(scaleDeploymentBody)

	if err := c.BodyParser(body); err != nil {
		return err
	}

	deployment.ScaleDeployment(K8, namespace, name, body.Replicas)

	return c.SendStatus(fiber.StatusNoContent)
}

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
	v1 "k8s.io/api/apps/v1"
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

// func GetDeploymentAsJson(c *fiber.Ctx, client *client.ClientManager) error {
// 	K8, err := client.Client()
// 	if err != nil {
// 		return err
// 	}

// 	namespace := shared.GetNamespace(c.Params("namespace"))
// 	name := c.Params("name")

// 	dep, err := deployment.GetJson(K8, namespace, name)
// 	if err != nil {
// 		return err
// 	}
// 	return c.Status(fiber.StatusOK).JSON(dep)
// }

func UpdateDeploymentFromJson(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client()
	if err != nil {
		return err
	}

	namespace := shared.GetNamespace(c.Params("namespace"))
	name := c.Params("name")

	body := new(v1.Deployment)

	if err := c.BodyParser(body); err != nil {
		panic(err)
	}

	if err := matchParam("name", body.Name, name); err != nil {
		return err
	}
	if err := matchParam("namespace", body.Namespace, namespace); err != nil {
		return err
	}

	err = deployment.UpdateDeployment(K8, namespace, name, body)
	if err != nil {
		return err
	}
	return c.SendStatus(fiber.StatusNoContent)
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

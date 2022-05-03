package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/git"
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

func CreateRepository(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	resourceType := c.Params("kind")
	resourceName := c.Params("name")

	_, err = K8.GitManager.CreateRepository(resourceType, resourceName)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(200)
}

func GetHistory(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}

	resourceType := c.Params("kind")
	resourceName := c.Params("name")

	dataSelector := types.BuildDataRequest(c).BuildDataSelector()

	repo, err := K8.GitManager.GetRepository(resourceType, resourceName)
	if err != nil {
		return errors.ParseInternalError(err)
	}

	hist, err := repo.History(git.HistoryRequest{Offset: dataSelector.Offset, PageSize: dataSelector.PageSize})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	return c.JSON(hist)
}

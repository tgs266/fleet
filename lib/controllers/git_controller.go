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

	gm, ok := K8.GetGitManager()
	if !ok {
		return errors.NewGitNotInitialized()
	}

	_, err = gm.CreateRepository(resourceType, resourceName)
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

	gm, ok := K8.GetGitManager()
	if !ok {
		return errors.NewGitNotInitialized()
	}

	repo, err := gm.GetRepository(resourceType, resourceName)
	if err != nil {
		return errors.ParseInternalError(err)
	}

	hist, err := repo.History(git.HistoryRequest{Offset: dataSelector.Offset, PageSize: dataSelector.PageSize})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	return c.JSON(hist)
}

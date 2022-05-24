package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/helm"
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

func HelmSearch(c *fiber.Ctx, client *client.ClientManager) error {
	m, e := helm.New()
	if e != nil {
		return e
	}
	dataSelector := types.BuildDataRequest(c).BuildDataSelector()

	res, err := m.Search(dataSelector)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(200).JSON(res)
}

func HelmSearchReleases(c *fiber.Ctx, client *client.ClientManager) error {
	m, e := helm.New()
	if e != nil {
		return e
	}
	dataSelector := types.BuildDataRequest(c).BuildDataSelector()

	res, err := m.SearchReleases(dataSelector)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(200).JSON(res)
}

func HelmGet(c *fiber.Ctx, client *client.ClientManager) error {
	m, e := helm.New()
	if e != nil {
		return e
	}
	name := c.Params("name")
	repo := c.Params("repo")

	res, err := m.Get(repo, name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(200).JSON(res)
}

func HelmGetRelease(c *fiber.Ctx, client *client.ClientManager) error {
	m, e := helm.New()
	if e != nil {
		return e
	}
	name := c.Params("name")

	res, err := m.GetRelease(name)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.Status(200).JSON(res)
}

func HelmInstall(c *fiber.Ctx, client *client.ClientManager) error {
	m, e := helm.New()
	if e != nil {
		return e
	}

	body := new(helm.InstallRequest)

	if err := c.BodyParser(body); err != nil {
		return err
	}

	err := m.Install(*body)
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return c.SendStatus(200)
}

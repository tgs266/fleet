package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/resources/image"
)

func GetAllImages(ctx *fiber.Ctx, client *client.ClientManager) error {
	images, err := image.GetAllImages()
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return ctx.Status(fiber.StatusOK).JSON(images)
}

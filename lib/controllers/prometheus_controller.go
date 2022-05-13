package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/client"
)

func PrometheusQuery(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}
	res, err := K8.Prometheus.DoQuery(c)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(res)
}

func PrometheusQueryRange(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}
	res, err := K8.Prometheus.DoQueryRange(c)
	if err != nil {
		return err
	}
	return c.Status(200).JSON(res)
}

func PrometheusAlert(c *fiber.Ctx, client *client.ClientManager) error {
	K8, err := client.Client(c)
	if err != nil {
		return err
	}
	res, err := K8.Prometheus.GetAlerts()
	if err != nil {
		return err
	}
	return c.Status(200).JSON(res)
}

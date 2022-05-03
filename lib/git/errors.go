package git

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/errors"
)

func NewRepositoryNotFound(resourceType string, resourceName string) *errors.FleetError {
	return &errors.FleetError{
		Status:  errors.STATUS_NOT_FOUND,
		Code:    fiber.StatusNotFound,
		Message: fmt.Sprintf("repository for resource %s of type %s not found", resourceName, resourceType),
	}
}

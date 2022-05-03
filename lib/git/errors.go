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

func NewResourceAlreadyExists(resourceType string, resourceName string) *errors.FleetError {
	return &errors.FleetError{
		Status:  errors.STATUS_BAD_REQUEST,
		Code:    fiber.StatusBadRequest,
		Message: fmt.Sprintf("repository for resource %s of type %s already exists", resourceName, resourceType),
	}
}

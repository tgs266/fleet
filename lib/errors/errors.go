package errors

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/logging"
	k8errors "k8s.io/apimachinery/pkg/api/errors"
)

type FleetError struct {
	Status  string `json:"status"`
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (e *FleetError) Error() string {
	return e.Message
}

func FiberErrorHandler(ctx *fiber.Ctx, err error) error {

	code := fiber.StatusInternalServerError
	message := &FleetError{Code: 500, Status: "INTERNAL_SERVER",
		Message: "Internal Server Error Occurred"}

	if e, ok := err.(*FleetError); ok {
		code = e.Code
		message = err.(*FleetError)
	} else {
		message = ParseInternalError(err).(*FleetError)
	}

	logging.ERRORf("%d - %s: %s", code, message.Status, message.Message)

	return ctx.Status(code).JSON(message)
}

func ParseInternalError(err error) error {
	if err == nil {
		return nil
	}
	fleetErr, ok := err.(*FleetError)
	if ok {
		return fleetErr
	}
	statusError, ok := err.(*k8errors.StatusError)
	if ok && statusError.Status().Code > 0 {
		statusCode := int(statusError.Status().Code)
		return CreateError(statusCode, statusError.Status().Message)
	}
	return CreateError(500, err.Error())
}

func CreateError(statusCode int, message string) *FleetError {
	return &FleetError{
		Status:  STATUS_UNKNOWN,
		Code:    statusCode,
		Message: message,
	}
}

func NewResourceNotFoundError(resourceType string, resourceName string) *FleetError {
	return &FleetError{
		Status:  STATUS_NOT_FOUND,
		Code:    fiber.StatusNotFound,
		Message: fmt.Sprintf("resource %s of type %s not found", resourceName, resourceType),
	}
}

func NewConfigInitializationError(err error) *FleetError {
	errText := "error initializing kubernetes config"
	if err != nil {
		errText = err.Error()
	}
	return &FleetError{
		Status:  STATUS_KUBERNETES_CONFIG,
		Code:    fiber.StatusInternalServerError,
		Message: errText,
	}
}

func NewBadRequestError(value string) *FleetError {
	return &FleetError{
		Status:  STATUS_BAD_REQUEST,
		Code:    fiber.StatusBadRequest,
		Message: value,
	}
}

func NewBadRequestMustProvideNamespace() *FleetError {
	return NewBadRequestError("must provide namespace for this request")
}

func NewBadRequestInvalidResourceType(rType string) *FleetError {
	return NewBadRequestError(fmt.Sprintf("resource type %s not supported", rType))
}

func NewBadRequestNonMatchingUrl(property string, urlVal string, passed string) *FleetError {
	return NewBadRequestError(fmt.Sprintf("the %s of the resource (%s) does not match the %s in the url (%s)", property, passed, property, urlVal))
}

func NewBadFilterError(filterIdx int, filter string) *FleetError {
	return NewBadRequestError(fmt.Sprintf("filter %d is invalid (%s)", filterIdx, filter))
}

func NewOperatorTypeMismatchError(operator string, type1 string, type2 string) *FleetError {

	return &FleetError{
		Status:  STATUS_BAD_REQUEST,
		Code:    fiber.StatusBadRequest,
		Message: fmt.Sprintf("type mismatch in operator %s. Types found were %s and %s", operator, type1, type2),
	}
}

func NewOperatorNotSupportedError(operator string) *FleetError {

	return &FleetError{
		Status:  STATUS_BAD_REQUEST,
		Code:    fiber.StatusBadRequest,
		Message: fmt.Sprintf("operator %s is not supported", operator),
	}
}

func NewComparableTypeNotSupportedError(typeName string) *FleetError {

	return &FleetError{
		Status:  STATUS_BAD_REQUEST,
		Code:    fiber.StatusBadRequest,
		Message: fmt.Sprintf("comparable for type %s is not supported", typeName),
	}
}

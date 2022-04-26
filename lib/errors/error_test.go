package errors

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParseInternalError(t *testing.T) {
	err := errors.New("asdf")
	parsedErr := ParseInternalError(err)
	assert.Equal(t, "asdf", parsedErr.(*FleetError).Message)
}

func TestNewConfigInitializationError(t *testing.T) {
	err := NewConfigInitializationError(errors.New("asdf"))
	parsedErr := ParseInternalError(err)
	assert.Equal(t, "asdf", parsedErr.(*FleetError).Message)
}

func TestNewBadRequestError(t *testing.T) {
	err := NewBadRequestError("bad!")
	assert.Equal(t, "bad!", err.Message)
}

func TestNewBadRequestMustProvideNamespace(t *testing.T) {
	err := NewBadRequestMustProvideNamespace()
	assert.Equal(t, "must provide namespace for this request", err.Message)
}

func TestNewResourceNotFoundError(t *testing.T) {
	err := NewResourceNotFoundError("adsf", "asdf")
	assert.Equal(t, 404, err.Code)
}

func TestNewBadRequestInvalidResourceType(t *testing.T) {
	err := NewBadRequestInvalidResourceType("asdf")
	assert.Equal(t, 400, err.Code)
}

func TestNewBadRequestNonMatchingUrl(t *testing.T) {
	err := NewBadRequestNonMatchingUrl("asdf", "a", "b")
	assert.Equal(t, 400, err.Code)
}

func TestNewBadFilterError(t *testing.T) {
	err := NewBadFilterError(1, "asdf")
	assert.Equal(t, 400, err.Code)
}

func TestNewOperatorTypeMismatchError(t *testing.T) {
	err := NewOperatorTypeMismatchError("asdf", "asdf", "asdf")
	assert.Equal(t, 400, err.Code)
}

func TestNewOperatorNotSupportedError(t *testing.T) {
	err := NewOperatorNotSupportedError("asdf")
	assert.Equal(t, 400, err.Code)
}

func TestNewComparableTypeNotSupportedError(t *testing.T) {
	err := NewComparableTypeNotSupportedError("asdf")
	assert.Equal(t, 400, err.Code)
}

func TestNewNoAuthenticationHeaderProvided(t *testing.T) {
	err := NewNoAuthenticationHeaderProvided()
	assert.Equal(t, 401, err.Code)
}

func TestNewInvalidBearerToken(t *testing.T) {
	err := NewInvalidBearerToken()
	assert.Equal(t, 401, err.Code)
}

func TestNewExpiredJWEToken(t *testing.T) {
	err := NewExpiredJWEToken()
	assert.Equal(t, 401, err.Code)
}

func TestNewInvalidJWEToken(t *testing.T) {
	err := NewInvalidJWEToken()
	assert.Equal(t, 401, err.Code)
}

func TestNewInvalidClaims(t *testing.T) {
	err := NewInvalidClaims()
	assert.Equal(t, 401, err.Code)
}

func TestNewInvalidJWEFormat(t *testing.T) {
	err := NewInvalidJWEFormat()
	assert.Equal(t, 401, err.Code)
}

func TestNewForbiddenAccess(t *testing.T) {
	err := NewForbiddenAccess()
	assert.Equal(t, 403, err.Code)
}

func TestNewInvalidKubernetesCredentials(t *testing.T) {
	err := NewInvalidKubernetesCredentials()
	assert.Equal(t, 401, err.Code)
}

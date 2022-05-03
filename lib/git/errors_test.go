package git

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNewRepositoryNotFound(t *testing.T) {
	assert.Equal(t, "NOT_FOUND", NewRepositoryNotFound("asdf", "asdf").Status)
}

func TestNewResourceAlreadyExists(t *testing.T) {
	assert.Equal(t, "BAD_REQUEST", NewResourceAlreadyExists("asdf", "asdf").Status)
}
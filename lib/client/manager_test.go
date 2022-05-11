package client

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestUsernameFromError(t *testing.T) {
	err := errors.New("asdfasdfasdf User \"Test\" cannot asdfasdf")
	assert.Equal(t, "Test", usernameFromError(err))
}

func TestUsernameFromSa(t *testing.T) {
	sa := "asdf:asdf:namespace:test"
	assert.Equal(t, "test", usernameFromSA(sa))
}

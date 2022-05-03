package git

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestNew(t *testing.T) {
	New(".fleet-test/git")
	os.RemoveAll(".fleet-test")
}

func TestCreateRepo(t *testing.T) {
	m := New(".fleet-test/git")
	_, err := m.CreateRepository("test", "asdf")
	assert.Nil(t, err)
	os.RemoveAll(".fleet-test")
}

func TestGetRepo(t *testing.T) {
	m := New(".fleet-test/git")
	_, err := m.CreateRepository("test", "asdf")
	assert.Nil(t, err)
	_, err = m.GetRepository("test", "asdf")
	assert.Nil(t, err)
	os.RemoveAll(".fleet-test")

}

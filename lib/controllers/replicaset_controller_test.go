package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestGetReplicaSets(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetReplicaSets)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetReplicaSet(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetReplicaSet)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRestartRS(t *testing.T) {
	app := setupApp()

	app.Put("/:namespace/:name", RestartReplicaSet)

	req := httptest.NewRequest("PUT", "/asdf/asdf", nil)

	app.Test(req)
}

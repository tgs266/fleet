package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestGetClusterRoles(t *testing.T) {
	app := setupApp()
	app.Get("/", GetClusterRoles)

	req := httptest.NewRequest("GET", "/", nil)

	app.Test(req)
}

func TestGetClusterRole(t *testing.T) {
	app := setupApp()
	app.Get("/:name", GetClusterRole)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

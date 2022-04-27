package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestGetRoles(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetRoles)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetRole(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetRole)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

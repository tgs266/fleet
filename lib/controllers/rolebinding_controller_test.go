package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestGetRoleBindings(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetRoleBindings)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetRoleBinding(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetRoleBinding)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

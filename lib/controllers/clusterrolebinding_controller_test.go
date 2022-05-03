package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestGetClusterRoleBindings(t *testing.T) {
	app := setupApp()
	app.Get("/", GetClusterRoleBindings)

	req := httptest.NewRequest("GET", "/", nil)

	app.Test(req)
}

func TestGetClusterRoleBinding(t *testing.T) {
	app := setupApp()
	app.Get("/:name", GetClusterRoleBinding)

	req := httptest.NewRequest("GET", "/asdf?sortBy=name,a", nil)

	app.Test(req)
}

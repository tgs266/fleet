package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestNamespaceList(t *testing.T) {
	app := setupApp()
	app.Get("/", GetNamespaces)

	req := httptest.NewRequest("GET", "/?sortBy=name,a", nil)

	app.Test(req)
}

func TestGetNamespace(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/", GetNamespace)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

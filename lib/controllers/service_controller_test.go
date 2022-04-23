package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestServiceList(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetServices)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetService(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetService)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

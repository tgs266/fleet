package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestRawGet(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:namespace/:name", RawGet)

	req := httptest.NewRequest("GET", "/pods/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRawGet2(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:namespace/:name", RawGet)

	req := httptest.NewRequest("GET", "/deployments/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRawDelete(t *testing.T) {
	app := setupApp()
	app.Delete("/:kind/:namespace/:name", RawDelete)

	req := httptest.NewRequest("DELETE", "/deployments/asdf/asdf", nil)

	app.Test(req)
}

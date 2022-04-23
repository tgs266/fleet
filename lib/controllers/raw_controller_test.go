package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestRawGet(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:namespace/:name", RawGet)

	req := httptest.NewRequest("GET", "/pod/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRawGet2(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:namespace/:name", RawGet)

	req := httptest.NewRequest("GET", "/deployment/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestCreateRepository(t *testing.T) {
	app := setupApp()
	app.Post("/:kind/:name", GetNamespaces)

	req := httptest.NewRequest("POST", "/asdf/asdf", nil)

	app.Test(req)
}

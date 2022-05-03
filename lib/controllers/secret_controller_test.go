package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestSecretList(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetSecrets)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetSecret(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetSecret)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

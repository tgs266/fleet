package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestServiceAccountList(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetServiceAccounts)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetServiceAccount(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetServiceAccount)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

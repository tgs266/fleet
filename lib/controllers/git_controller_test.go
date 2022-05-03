package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestCreateRepository(t *testing.T) {
	app := setupApp()
	app.Post("/:kind/:name", CreateRepository)

	req := httptest.NewRequest("POST", "/asdf/asdf", nil)

	app.Test(req)
}

func TestGetHistory(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:name", GetHistory)

	req := httptest.NewRequest("GET", "/asdf/asdf", nil)

	app.Test(req)
}

package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestNodeList(t *testing.T) {
	app := setupApp()
	app.Get("/", GetNodes)

	req := httptest.NewRequest("GET", "/", nil)

	app.Test(req)
}

func TestGetNode(t *testing.T) {
	app := setupApp()
	app.Get("/:name", GetNode)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

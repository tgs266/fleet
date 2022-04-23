package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestPodList(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetPodMetaList)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetPod(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetPod)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestDeletePod(t *testing.T) {
	app := setupApp()
	app.Delete("/:namespace/:name", DeletePod)

	req := httptest.NewRequest("DELETE", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

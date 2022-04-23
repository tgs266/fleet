package controllers

import (
	"net/http/httptest"
	"testing"
)

func TestGetPodContainer(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:podName/:containerName", GetPodContainer)

	req := httptest.NewRequest("GET", "/asdf/aasdf/asdf", nil)

	app.Test(req)
}

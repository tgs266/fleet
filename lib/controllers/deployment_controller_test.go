package controllers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"
)

func TestGetDeploymentStubList(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace", GetDeploymentStubList)

	req := httptest.NewRequest("GET", "/asdf", nil)

	app.Test(req)
}

func TestGetDeployment(t *testing.T) {
	app := setupApp()
	app.Get("/:namespace/:name", GetDeployment)

	req := httptest.NewRequest("GET", "/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRestartDeployment(t *testing.T) {
	app := setupApp()

	app.Put("/:namespace/:name", RestartDeployment)

	req := httptest.NewRequest("PUT", "/asdf/asdf", nil)

	app.Test(req)
}

func TestScaleDeployment(t *testing.T) {
	app := setupApp()

	data := scaleDeploymentBody{
		Replicas: 5,
	}
	db, _ := json.Marshal(data)

	app.Put("/:namespace/:name", ScaleDeployment)

	req := httptest.NewRequest("PUT", "/asdf/asdf", bytes.NewBuffer(db))

	app.Test(req)
}

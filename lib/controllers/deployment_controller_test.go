package controllers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	"github.com/tgs266/fleet/lib/kubernetes/resources/deployment"
	"github.com/tgs266/fleet/lib/kubernetes/resources/image"
)

func TestGetDeploymentStubListWithAuth(t *testing.T) {
	app := setupAppAuth()
	app.Get("/:namespace", GetDeploymentStubList)

	req := httptest.NewRequest("GET", "/asdf", nil)
	req.Header.Add("jweToken", "asdfasdfasdf")

	app.Test(req)
}

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

func TestRestartDeploymentWithAuth(t *testing.T) {
	app := setupAppAuth()
	app.Put("/:namespace/:name", RestartDeployment)

	req := httptest.NewRequest("PUT", "/asdf/asdf", nil)
	req.Header.Add("Authorization", "Bearer asdfasdfasdf")

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

func TestDeleteDeployment(t *testing.T) {
	app := setupApp()

	app.Delete("/:namespace/:name", DeleteDeployment)

	req := httptest.NewRequest("DELETE", "/asdf/asdf", nil)

	app.Test(req)
}

func TestUpdateDeploymentContainerSpec(t *testing.T) {
	app := setupApp()

	data := container.ContainerSpec{
		Name: "asdf",
		Image: image.Image{
			Name: "asdf",
			Tag:  "asdf",
		},
		Ports:           []*container.Port{},
		EnvVars:         []*container.Env{},
		ImagePullPolicy: "asdf",

		CPURequests: 12,
		MemRequests: 12,
		CPULimit:    12,
		MemLimit:    12,
	}
	db, _ := json.Marshal(data)

	app.Put("/:namespace/:name/:specName", UpdateDeploymentContainerSpec)

	req := httptest.NewRequest("PUT", "/asdf/asdf/asdf", bytes.NewBuffer(db))

	app.Test(req)
}

func TestCreateDeployment(t *testing.T) {
	app := setupApp()

	data := deployment.DeploymentCreation{
		Name:      "asdf",
		Namespace: "adsf",
		Replicas:  3,
		ContainerSpecs: []container.ContainerSpec{
			{
				Name: "asdf",
				Image: image.Image{
					Name: "asdf",
					Tag:  "asdf",
				},
				Ports:           []*container.Port{},
				EnvVars:         []*container.Env{},
				ImagePullPolicy: "asdf",

				CPURequests: 12,
				MemRequests: 12,
				CPULimit:    12,
				MemLimit:    12,
			},
		},
	}
	db, _ := json.Marshal(data)

	app.Put("/:namespace/:name/", CreateDeployment)

	req := httptest.NewRequest("PUT", "/asdf/asdf/asdf", bytes.NewBuffer(db))

	app.Test(req)
}

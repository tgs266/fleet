package controllers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/tgs266/fleet/lib/helm"
)

func TestHelmSearch(t *testing.T) {
	app := setupApp()
	app.Get("/", HelmSearch)

	req := httptest.NewRequest("GET", "/?sortBy=name,a", nil)

	app.Test(req)
}

func TestHelmSearchReleases(t *testing.T) {
	app := setupApp()
	app.Get("/", HelmSearchReleases)

	req := httptest.NewRequest("GET", "/?sortBy=name,a", nil)

	app.Test(req)
}

func TestHelmInstall(t *testing.T) {
	app := setupApp()
	app.Post("/asdf", HelmInstall)

	data := helm.InstallRequest{
		Repo:        "string",
		ChartName:   "string",
		ReleaseName: "string",
		Version:     "string",
		Values:      "string",
		Namespace:   "string",
	}

	db, _ := json.Marshal(data)

	req := httptest.NewRequest("POST", "/asdf", bytes.NewBuffer(db))

	app.Test(req)
}

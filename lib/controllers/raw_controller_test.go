package controllers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"k8s.io/apimachinery/pkg/runtime"
)

func TestRawGet(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:namespace/:name", RawGet)

	req := httptest.NewRequest("GET", "/pods/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRawGet2(t *testing.T) {
	app := setupApp()
	app.Get("/:kind/:namespace/:name", RawGet)

	req := httptest.NewRequest("GET", "/deployments/asdf/asdf?sortBy=name,a", nil)

	app.Test(req)
}

func TestRawPut(t *testing.T) {
	app := setupApp()
	app.Put("/:kind/:namespace/:name", RawPut)

	data := runtime.Unknown{
		TypeMeta: runtime.TypeMeta{
			APIVersion: "1",
			Kind:       "deployment",
		},
		Raw: []byte("asdfasdfasfd"),
	}
	db, _ := json.Marshal(data)

	req := httptest.NewRequest("PUT", "/deployments/asdf/asdf", bytes.NewBuffer(db))

	app.Test(req)
}

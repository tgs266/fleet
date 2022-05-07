package controllers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/tgs266/fleet/lib/prometheus"
)

func TestPromGet(t *testing.T) {
	app := setupApp()
	app.Get("/query?query=asdf", PrometheusQuery)

	req := httptest.NewRequest("GET", "/query?query=asdf", nil)

	app.Test(req)
}

func TestPromPostRange(t *testing.T) {
	app := setupApp()
	app.Post("/query", PrometheusQueryRange)

	data := map[string]prometheus.PrometheusQueryRangeRequest{
		"asdf": {
			Query: "asdf",
		},
	}

	db, _ := json.Marshal(data)

	req := httptest.NewRequest("POST", "/query", bytes.NewBuffer(db))

	app.Test(req)
}

func TestPromPost(t *testing.T) {
	app := setupApp()
	app.Post("/query", PrometheusQuery)

	data := map[string]prometheus.PrometheusQueryRequest{
		"asdf": {
			Query: "asdf",
		},
	}

	db, _ := json.Marshal(data)

	req := httptest.NewRequest("POST", "/query", bytes.NewBuffer(db))

	app.Test(req)
}

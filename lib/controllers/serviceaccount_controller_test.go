package controllers

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/tgs266/fleet/lib/kubernetes/resources/serviceaccount"
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

func TestConnectToRoleBinding(t *testing.T) {
	app := setupApp()
	app.Put("/:namespace/:name/bind", ConnectToRoleBinding)

	data := serviceaccount.BindRequest{
		TargetRoleName:      "asdf",
		TargetRoleNamespace: "asdf",
	}

	dataBytes, _ := json.Marshal(data)

	req := httptest.NewRequest("PUT", "/asdf/asdf/bind", bytes.NewBuffer(dataBytes))

	app.Test(req)
}

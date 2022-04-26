package controllers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/oauth2-proxy/mockoidc"
	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/auth"
	"github.com/tgs266/fleet/lib/auth/oidc"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/logging"
)

func IsOIDCAvailableFail(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()

	logging.Init(logging.LVL_INFO)

	manager := client.NewClientManager(true)
	manager.TestMode = true
	manager.InitializeOIDC(oidc.OIDCConfig{
		IssuerURL:        m.Issuer(),
		ClientID:         m.ClientID,
		ClientSecret:     m.ClientSecret,
		UseOfflineAccess: false,
	})

	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})

	AddUnsupportedOIDCRoute(app)

	req := httptest.NewRequest("GET", "/api/v1/auth/oauth2/", nil)

	app.Test(req)
}

func IsOIDCAvailable(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()

	logging.Init(logging.LVL_INFO)

	manager := client.NewClientManager(true)
	manager.TestMode = true
	manager.InitializeOIDC(oidc.OIDCConfig{
		IssuerURL:        m.Issuer(),
		ClientID:         m.ClientID,
		ClientSecret:     m.ClientSecret,
		UseOfflineAccess: false,
	})

	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})

	AddOIDCRoutes(app)

	req := httptest.NewRequest("GET", "/api/v1/auth/oauth2/", nil)

	app.Test(req)
}

func TestGetOIDC(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()

	logging.Init(logging.LVL_INFO)

	manager := client.NewClientManager(true)
	manager.TestMode = true
	manager.InitializeOIDC(oidc.OIDCConfig{
		IssuerURL:        m.Issuer(),
		ClientID:         m.ClientID,
		ClientSecret:     m.ClientSecret,
		UseOfflineAccess: false,
	})

	app := api.New(manager, fiber.Config{
		DisableStartupMessage: true,
	})

	AddOIDCRoutes(app)

	req := httptest.NewRequest("GET", "/api/v1/auth/oauth2/url?location=asdf", nil)

	res, _ := app.Test(req)

	defer res.Body.Close()

	var j string
	err := json.NewDecoder(res.Body).Decode(&j)
	assert.Nil(t, err)

	req2, _ := http.NewRequest("GET", j, nil)
	req2.AddCookie(res.Cookies()[0])
	req2.AddCookie(res.Cookies()[1])
	req2.AddCookie(res.Cookies()[2])

	res2, err := http.DefaultClient.Do(req2)
	assert.Nil(t, err)

	defer res2.Body.Close()

	var j2 interface{}
	err = json.NewDecoder(res2.Body).Decode(&j2)
	assert.Nil(t, err)

	code := res2.Request.URL.Query().Get("code")

	req3 := httptest.NewRequest("GET", "/api/v1/auth/oauth2/callback?state="+res.Cookies()[1].Value+"&code="+code, nil)
	req3.AddCookie(res.Cookies()[0])
	req3.AddCookie(res.Cookies()[1])
	req3.AddCookie(res.Cookies()[2])

	_, err = app.Test(req3)
	assert.Nil(t, err)
}

func TestLogin(t *testing.T) {
	app := setupAppAuth()

	app.Post("/api/v1/auth/login", Login)

	data := &auth.LoginRequest{
		Token: "asdfasdfasdfasf",
	}

	db, _ := json.Marshal(data)

	req := httptest.NewRequest(http.MethodPost, "/api/v1/auth/login", bytes.NewBuffer(db))

	app.Test(req)
}

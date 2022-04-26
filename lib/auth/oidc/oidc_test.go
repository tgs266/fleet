package oidc

import (
	"testing"

	"github.com/tgs266/fleet/lib/logging"
)

func TestInit(t *testing.T) {
	logging.Init(logging.LVL_INFO)

	manager := &OIDCManager{}
	manager.Init(OIDCConfig{
		IssuerURL:    "https://example.com/auth",
		ClientID:     "asdf",
		ClientSecret: "asdf",
	})
}

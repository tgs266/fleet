package oidc

import (
	"testing"

	"github.com/oauth2-proxy/mockoidc"
	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/logging"
)

func TestInit(t *testing.T) {
	m, _ := mockoidc.Run()
	defer m.Shutdown()
	logging.Init(logging.LVL_INFO)

	manager := &OIDCManager{}
	err := manager.Init(OIDCConfig{
		IssuerURL:    m.Issuer(),
		ClientID:     m.ClientID,
		ClientSecret: m.ClientSecret,
	})

	assert.Nil(t, err)
}

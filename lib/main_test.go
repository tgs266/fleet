package main

import (
	"testing"

	"github.com/tgs266/fleet/lib/logging"
)

func TestMain(t *testing.T) {
	logging.Init(logging.LVL_INFO)

	setupApp()
}

func TestSetupBackend(t *testing.T) {
	logging.Init(logging.LVL_INFO)

	useAuth := true
	str := "asdf"

	flags := Flags{
		useAuth:          &useAuth,
		oidcIssuerUrl:    &str,
		oidcClientId:     &str,
		oidcClientSecret: &str,
		host:             &str,
	}

	setupBackend(flags)
}

func TestSetupBackend2(t *testing.T) {
	defer func() {
		if r := recover(); r != nil {
			return
		}
	}()
	logging.Init(logging.LVL_INFO)

	useAuth := true
	str := "asdf"
	flags := Flags{
		useAuth:          &useAuth,
		oidcIssuerUrl:    &str,
		oidcClientId:     &str,
		oidcClientSecret: &str,
		host:             &str,
	}

	setupBackend(flags)
}

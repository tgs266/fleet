package main

import (
	"testing"

	"github.com/tgs266/fleet/lib/logging"
)

func TestSetupApp(t *testing.T) {
	logging.Init(logging.LVL_INFO)

	useAuth := true
	flags := Flags{
		useAuth: &useAuth,
	}

	setupApp(flags)
}

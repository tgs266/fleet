package deployment

import (
	"os"
	"testing"

	"github.com/tgs266/fleet/lib/logging"
)

func TestMain(m *testing.M) {
	logging.Init(logging.LVL_INFO)
	code := m.Run()
	os.Exit(code)
}

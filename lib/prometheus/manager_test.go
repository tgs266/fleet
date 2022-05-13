package prometheus

import (
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/logging"
	"github.com/valyala/fasthttp"
	"k8s.io/client-go/rest/fake"
)

func setup() (*fiber.App, PrometheusManager) {
	logging.Init(logging.LVL_INFO)
	app := fiber.New()
	return app, *New(&fake.RESTClient{})
}

func TestNew(t *testing.T) {
	setup()
}

func TestDoQuery(t *testing.T) {
	app, client := setup()
	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})
	client.DoQuery(ctx)
}

func TestDoRangeQuery(t *testing.T) {
	app, client := setup()
	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})
	client.DoQueryRange(ctx)
}

func TestGetAlerts(t *testing.T) {
	_, client := setup()
	client.GetAlerts()
}

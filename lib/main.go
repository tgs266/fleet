package main

import (
	"flag"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/auth/jwe"
	"github.com/tgs266/fleet/lib/auth/oidc"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/controllers"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/fleet"
	"github.com/tgs266/fleet/lib/logging"
)

func createFiberConfig() fiber.Config {
	return fiber.Config{
		DisableStartupMessage: true,
		ErrorHandler:          errors.FiberErrorHandler,
	}
}

type Flags struct {
	src              *string
	tokenTTL         *int
	useAuth          *bool
	oidcIssuerUrl    *string
	oidcClientId     *string
	oidcClientSecret *string
	host             *string
	port             *string
}

func parseFlags() Flags {
	src := flag.String("src", "", "frontend source")
	tokenTtl := flag.Int("tokenTTL", 900, "token time-to-live (seconds)")
	useAuth := flag.Bool("useAuth", false, "use authentication")
	oidcIssuerUrl := flag.String("oidc-issuer-url", "", "used for oidc authentication")
	oidcClientId := flag.String("oidc-client-id", "", "used for oidc authentication")
	oidcClientSecret := flag.String("oidc-client-secret", "", "used for oidc authentication")
	host := flag.String("host", "", "")
	port := flag.String("port", "9095", "")

	flag.Parse()
	return Flags{
		src:              src,
		tokenTTL:         tokenTtl,
		useAuth:          useAuth,
		oidcIssuerUrl:    oidcIssuerUrl,
		oidcClientId:     oidcClientId,
		oidcClientSecret: oidcClientSecret,
		host:             host,
		port:             port,
	}
}

func setupBackend(flags Flags) *api.API {
	manager := client.NewClientManager(*flags.useAuth)

	if *flags.oidcIssuerUrl != "" {
		err := manager.InitializeOIDC(oidc.OIDCConfig{
			IssuerURL:        *flags.oidcIssuerUrl,
			ClientID:         *flags.oidcClientId,
			ClientSecret:     *flags.oidcClientSecret,
			Host:             *flags.host,
			UseOfflineAccess: true,
		})
		if err != nil {
			logging.ERROR(err)
		}
	}

	app := api.New(manager, createFiberConfig())
	logging.INFO("api created")

	app.RegisterMiddleware(cors.New())
	app.RegisterMiddleware(recover.New())

	app.Use("/ws", func(c *fiber.Ctx) error {
		// IsWebSocketUpgrade returns true if the client
		// requested upgrade to the WebSocket protocol.
		if websocket.IsWebSocketUpgrade(c) {

			c.Request().Header.Set("jweToken", c.Query("jwe", "asdf"))
			k8, err := manager.Client(c)

			c.Locals("allowed", true)
			c.Locals("k8", k8)
			c.Locals("k8err", err)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Use("/sse", func(c *fiber.Ctx) error {
		authHeader := string(c.Query("Authorization"))
		jweToken := string(c.Query("jweToken"))
		impersonate := string(c.Query("Impersonate-User"))
		impersonateGroups := string(c.Query("Impersonate-Groups"))

		c.Request().Header.Add("Authorization", authHeader)
		c.Request().Header.Add("jweToken", jweToken)
		c.Request().Header.Add("Impersonate-User", impersonate)
		c.Request().Header.Add("Impersonate-Groups", impersonateGroups)
		return c.Next()
	})

	logging.INFO("middleware registered")

	logging.INFO("initializing routing")
	controllers.InitializeRoutes(app)

	if *flags.oidcIssuerUrl != "" {
		logging.INFO("initializing OIDC routing")
		controllers.AddOIDCRoutes(app)
	} else {
		controllers.AddUnsupportedOIDCRoute(app)
	}

	logging.INFO("routing initialization completed")
	logging.INFO("initializing fleet routes")

	fleet.AddRoutes(app)

	logging.INFO("fleet routes initialization complete")
	return app
}

func setupApp() (*api.API, Flags) {
	logging.Init(logging.LVL_INFO)
	logging.INFO("initializing fleet")

	flags := parseFlags()

	jwe.TOKEN_TTL = *flags.tokenTTL

	app := setupBackend(flags)

	if flags.src != nil {
		path := *flags.src
		logging.INFO(fmt.Sprintf("serving frontend from %s", path))
		app.Static("/", path)
	}
	return app, flags
}

func main() {
	app, f := setupApp()
	app.Listen(":" + *f.port)
}

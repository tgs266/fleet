package main

import (
	"flag"
	"fmt"

	// "github.com/coreos/go-oidc/v3/oidc"
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

func main() {

	logging.Init(logging.LVL_INFO)
	logging.INFO("initializing fleet")

	src := flag.String("src", "", "frontend source")
	tokenTtl := flag.Int("tokenTTL", 900, "token time-to-live (seconds)")
	useAuth := flag.Bool("useAuth", false, "use authentication")
	oidcIssuerUrl := flag.String("oidc-issuer-url", "", "used for oidc authentication")
	oidcClientId := flag.String("oidc-client-id", "", "used for oidc authentication")
	oidcClientSecret := flag.String("oidc-client-secret", "", "used for oidc authentication")
	host := flag.String("host", "", "")

	flag.Parse()

	jwe.TOKEN_TTL = *tokenTtl

	// provider, err := oidc.NewProvider(context.TODO(), "https://dev-86695282.okta.com/oauth2/default")
	// oauth2Config := oauth2.Config{
	// 	ClientID:     "0oa4tllmr4qYmj3OB5d7",
	// 	ClientSecret: "Y_LRAwPjWo8gQMbQyrRnQnTAmst3DL6-ZcIpfbkI",
	// 	RedirectURL:  "http://localhost:9095/api/v1/auth/ouath2/callback",

	// 	// Discovery returns the OAuth2 endpoints.
	// 	Endpoint: provider.Endpoint(),

	// 	// "openid" is a required scope for OpenID Connect flows.
	// 	Scopes: []string{oidc.ScopeOpenID, oidc.ScopeOfflineAccess, "profile", "email"},
	// }
	// state, _ := randString(16)
	// nonce, _ := randString(16)
	// fmt.Println(oauth2Config.AuthCodeURL(state, oidc.Nonce(nonce)))

	manager := client.NewClientManager(*useAuth)

	if oidcIssuerUrl != nil {
		manager.InitializeOIDC(oidc.OIDCConfig{
			IssuerURL:    *oidcIssuerUrl,
			ClientID:     *oidcClientId,
			ClientSecret: *oidcClientSecret,
			Host:         *host,
		})
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
			// if err != nil {
			// 	return err
			// }

			c.Locals("allowed", true)
			c.Locals("k8", k8)
			c.Locals("k8err", err)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	logging.INFO("middleware registered")

	logging.INFO("initializing routing")
	controllers.InitializeRoutes(app)

	if oidcIssuerUrl != nil && *oidcIssuerUrl != "" {
		logging.INFO("initializing OIDC routing")
		controllers.AddOIDCRoutes(app)
	} else {
		controllers.AddUnsupportedOIDCRoute(app)
	}

	logging.INFO("routing initialization completed")
	logging.INFO("initializing fleet routes")

	fleet.AddRoutes(app)

	logging.INFO("fleet routes initialization complete")

	if src != nil {
		path := *src
		logging.INFO(fmt.Sprintf("serving frontend from %s", path))
		app.Static("/", path)
	}

	app.Listen(":9095")
}

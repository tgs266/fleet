package fleet

import (
	"path/filepath"

	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
	"k8s.io/client-go/util/homedir"
)

func AddRoutes(app *api.API) {
	app.WebsocketGet("/ws/v1/fleet", Websocket)
}

func Websocket(c *websocket.Conn, cl *client.ClientManager) {
	manager := client.NewClientManager(filepath.Join(homedir.HomeDir(), ".kube", "config"))

	K8, err := manager.Client()
	if err != nil {
		c.Close()
	}

	Run(c, K8, 1000)

	// body := new(FleetRequest)
	// if err := c.BodyParser(body); err != nil {
	// 	c.Close()
	// }

	// fm, err := BuildFleet(K8, body)
	// body := new(FleetRequest)
	// if err := c.BodyParser(body); err != nil {
	// 	c.Close()
	// }

	// fm, err := BuildFleet(K8, body)
}

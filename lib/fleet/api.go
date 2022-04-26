package fleet

import (
	"encoding/json"

	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
)

func AddRoutes(app *api.API) {
	app.WebsocketGet("/ws/v1/fleet", Websocket)
}

func Websocket(c *websocket.Conn, cl *client.ClientManager) {
	defer func() {
		if r := recover(); r != nil {
			c.Close()
		}
	}()
	err := c.Locals("k8err")
	if err != nil {
		bytes, _ := json.Marshal(err.(*errors.FleetError))
		c.WriteMessage(8, bytes)
		c.Close()
		return
	}
	K8 := c.Locals("k8").(*kubernetes.K8Client)
	Run(c, K8, 1000)
}

package fleet

import (
	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
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
	manager := client.NewClientManager()

	K8, err := manager.Client()
	if err != nil {
		c.Close()
	}

	Run(c, K8, 1000)

}

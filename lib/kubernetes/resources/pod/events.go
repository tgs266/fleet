package pod

import (
	"context"
	"strings"
	"time"

	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/event"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/logging"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func StreamPodEvents(K8 *kubernetes.K8Client, namespace string, name string, c *websocket.Conn, pollInterval int) {
	logging.INFOf("opening event stream for pod %s/%s", namespace, name)
	ds := types.DataSelector{
		PageSize: -1,
		Offset:   -1,

		SortBy: []types.SortBy{types.SortBy{Property: types.LastSeenProperty, Ascending: true}},
	}
	for {
		events, _ := K8.K8.CoreV1().Events(namespace).List(context.Background(), metaV1.ListOptions{
			FieldSelector: "involvedObject.name=" + name, TypeMeta: metaV1.TypeMeta{Kind: "Pod"},
		})

		comparableEvents := event.ToComparable(events)
		ds.Execute(comparableEvents)
		events = event.FromComparable(ds.Items)

		responseEvents := []event.Event{}
		for _, e := range events.Items {
			responseEvents = append(responseEvents, event.BuildEvent(e))
		}
		if err := c.WriteJSON(responseEvents); err != nil {
			if strings.Contains(err.Error(), "An established connection was aborted by the software") {
				logging.INFOf("closing event stream for deployment %s/%s", namespace, name)
				return
			}
			panic(err)
		}
		time.Sleep(time.Duration(pollInterval) * time.Millisecond)
	}

}

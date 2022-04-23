package fleet

import (
	"encoding/json"
	"time"

	"github.com/gofiber/websocket/v2"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/resources/deployment"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// func Compare

func Contains(arr []string, match string) bool {
	for _, str := range arr {
		if str == match {
			return true
		}
	}
	return false
}

func GetByUID(uid string, fleet []*FleetObject) (*FleetObject, int) {
	for id, obj := range fleet {
		if obj.Meta.UID == uid {
			return obj, id
		}
	}
	return nil, -1
}

func ExtractIdentifiers(fleet []*FleetObject) []string {
	ret := []string{}
	for _, obj := range fleet {
		ret = append(ret, obj.Meta.UID)
	}
	return ret
}

func Run(c *websocket.Conn, K8 *kubernetes.K8Client, timeout int) {
	_, bytes, _ := c.ReadMessage()
	var req FleetRequest
	json.Unmarshal(bytes, &req)
	first := true
	last := []*FleetObject{}
	tempLast := []*FleetObject{}
	lastTitles := []string{}
	for {

		fleet, err := BuildFleet(K8, &req)
		if err != nil {
			time.Sleep(time.Duration(timeout) * time.Millisecond)
			continue
		}

		if first {
			last = fleet
			lastTitles = ExtractIdentifiers(fleet)
			c.WriteJSON(fleet)
			first = false
			time.Sleep(time.Duration(timeout) * time.Millisecond)
			continue
		}

		for i, obj := range fleet {
			if !Contains(lastTitles, obj.Meta.UID) {
				fleet[i].Mode = "NEW"
				continue
			}
		}

		tempLast = []*FleetObject{}
		for _, f := range fleet {
			x := *f
			tempLast = append(tempLast, &x)
		}

		fleet = CleanFleet(lastTitles, last, fleet)

		last = tempLast
		lastTitles = ExtractIdentifiers(tempLast)
		e := c.WriteJSON(fleet)
		if e != nil {
			return
		}

		time.Sleep(time.Duration(timeout) * time.Millisecond)
	}
}

func CleanFleet(lastTitles []string, last []*FleetObject, fleet []*FleetObject) []*FleetObject {
	for _, n := range lastTitles {
		data, _ := GetByUID(n, fleet)
		if data == nil {
			fleet = append(fleet, &FleetObject{
				Meta: FleetObjectMeta{
					UID: n,
				},
				Mode: "DELETE",
			})
		} else {
			lastData, _ := GetByUID(n, last)
			lastChildren := lastData.Children
			newChildren := data.Children

			newMap := map[string]FleetObject{}

			for str, nc := range newChildren {
				if value, found := lastChildren[str]; found {
					if value.Status.Reason != nc.Status.Reason || value.Status.Value != nc.Status.Value {
						nc.Mode = "UPDATE"
						newMap[str] = nc
					}
				} else {
					nc.Mode = "NEW"
					newMap[str] = nc
				}
			}

			for str, lc := range lastChildren {
				if _, found := newChildren[str]; !found {
					lc.Mode = "DELETE"
					newMap[str] = lc
				}
			}

			data.Children = newMap
		}
	}
	return fleet
}

func BuildFleet(K8 *kubernetes.K8Client, fleetRequest *FleetRequest) ([]*FleetObject, error) {
	if len(fleetRequest.Dimensions) > 2 {
		return nil, errors.NewBadRequestError("too many dimensions (max 2)")
	}

	dim0 := fleetRequest.Dimensions[0]
	hasSecond := len(fleetRequest.Dimensions) == 2

	dataSelector := dim0.BuildDataSelector()

	switch dim0.Dimension {
	case DeploymentDimName:
		dc := channels.GetDeploymentListChannel(K8.K8, "", metav1.ListOptions{}, 1)
		deps, err := deployment.CompareOnChannel(dc, dataSelector)
		if err != nil {
			return nil, err
		}
		if hasSecond {
			return BuildFleetFromDeployments(K8, *deps, fleetRequest.Dimensions[1])
		} else {
			return nil, errors.NewBadRequestError("cannot do single yet")
		}
	case PodDimName:
		dc := channels.GetPodListChannel(K8.K8, "", metav1.ListOptions{}, 1)
		pods, err := pod.CompareOnChannel(dc, dataSelector)
		if err != nil {
			return nil, err
		}
		if hasSecond {
			return BuildFleetFromPods(K8, *pods, &fleetRequest.Dimensions[1])
		} else {
			return BuildFleetFromPods(K8, *pods, nil)
		}
	default:
		return nil, errors.NewBadRequestError("dimension " + string(dim0.Dimension) + " not supported as top level dimension")
	}
	return nil, errors.NewBadRequestError("dimension " + string(dim0.Dimension) + " not supported as top level dimension")
}

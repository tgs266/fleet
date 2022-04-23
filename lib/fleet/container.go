package fleet

import (
	"github.com/tgs266/fleet/lib/kubernetes/resources"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	v1 "k8s.io/api/core/v1"
)

func buildContainerFleetObject(pod v1.Pod, container v1.Container, state v1.ContainerState) FleetObject {
	fom := FleetObjectMeta{
		UID:       string(pod.UID) + "-" + container.Name,
		Name:      container.Name,
		Namespace: pod.Namespace,
		Details: map[string]string{
			"image": container.Image,
			"pod":   pod.Name,
		},
	}
	return FleetObject{
		Meta:      fom,
		Status:    getContainerStatus(state),
		Children:  nil,
		Dimension: ContainerDimName,
	}
}

func getContainerStatus(state v1.ContainerState) FleetStatus {
	cState := container.GetStatus(state)
	switch cState {
	case resources.RUNNING_STATUS:
		return FleetStatus{
			Color:  GREEN_RGB,
			Value:  string(cState),
			Reason: "",
		}
	case resources.WAITING_STATUS:
		return FleetStatus{
			Color:  YELLOW_RGB,
			Value:  string(cState),
			Reason: "",
		}
	case resources.TERMINATED_STATUS:
		return FleetStatus{
			Color:  RED_RGB,
			Value:  string(cState),
			Reason: "",
		}
	}
	return FleetStatus{
		Color:  RED_RGB,
		Value:  string(resources.TERMINATED_STATUS),
		Reason: "",
	}
}

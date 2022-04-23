package fleet

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	v1 "k8s.io/api/core/v1"
)

func BuildObjectFromPod(p v1.Pod) *FleetObject {
	fom := FleetObjectMeta{
		UID:       string(p.UID),
		Name:      p.Name,
		Namespace: p.Namespace,
	}
	return &FleetObject{
		Meta:      fom,
		Status:    getPodStatus(p),
		Children:  make(map[string]FleetObject, 0),
		Dimension: PodDimName,
	}

}

func BuildFleetFromPods(K8 *kubernetes.K8Client, deps v1.PodList, dimension *FleetRequestDimension) ([]*FleetObject, error) {
	output := []*FleetObject{}
	for _, d := range deps.Items {
		manager := BuildObjectFromPod(d)
		if dimension != nil {
			switch dimension.Dimension {
			case ContainerDimName:
				// manager.Children
				children := map[string]FleetObject{}
				for c, _ := range d.Spec.Containers {
					cont := d.Spec.Containers[c]
					var state v1.ContainerState
					if len(d.Spec.Containers) == len(d.Status.ContainerStatuses) {
						state = d.Status.ContainerStatuses[c].State
					}
					obj := buildContainerFleetObject(d, cont, state)
					children[obj.Meta.UID] = obj
				}
				manager.Children = children
			default:
				return nil, errors.NewBadRequestError("dimension " + string(dimension.Dimension) + " not supported as a child of pod")
			}
			output = append(output, manager)
		}
	}
	return output, nil
}

func getPodStatus(p v1.Pod) FleetStatus {
	status := pod.GetPodStatus(&p)
	switch status.GenericStatus {
	case resources.RUNNING_STATUS:
		return FleetStatus{
			Color:  GREEN_RGB,
			Value:  string(status.GenericStatus),
			Reason: "",
		}
	case resources.PENDING_STATUS:
		return FleetStatus{
			Color:  YELLOW_RGB,
			Value:  string(status.GenericStatus),
			Reason: "",
		}
	case resources.TERMINATED_STATUS:
		return FleetStatus{
			Color:  RED_RGB,
			Value:  string(status.GenericStatus),
			Reason: "",
		}
	}
	return FleetStatus{
		Color:  RED_RGB,
		Value:  "Terminated",
		Reason: status.Reason,
	}
}

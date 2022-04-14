package fleet

import (
	"fmt"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	v1 "k8s.io/api/apps/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func BuildObjectFromDeployment(d v1.Deployment) *FleetObject {
	fom := FleetObjectMeta{
		UID:       string(d.UID),
		Name:      d.Name,
		Namespace: d.Namespace,
	}
	return &FleetObject{
		Meta:      fom,
		Status:    getDeploymentStatus(int(d.Status.ReadyReplicas), int(*d.Spec.Replicas)),
		Children:  make(map[string]FleetObject, 0),
		Dimension: DeploymentDimName,
	}
}

func BuildFleetFromDeployments(K8 *kubernetes.K8Client, deps v1.DeploymentList, dimension FleetRequestDimension) ([]*FleetObject, error) {
	output := []*FleetObject{}
	for _, d := range deps.Items {
		ds := dimension.BuildDataSelector()
		manager := BuildObjectFromDeployment(d)
		switch dimension.Dimension {
		case PodDimName:
			selector, err := metaV1.LabelSelectorAsSelector(d.Spec.Selector)
			if err != nil {
				return nil, err
			}
			options := metaV1.ListOptions{LabelSelector: selector.String()}
			manager.channel = GetPodMetaChannel(K8, d.Namespace, options, ds)
		case ContainerDimName:
			selector, err := metaV1.LabelSelectorAsSelector(d.Spec.Selector)
			if err != nil {
				return nil, err
			}
			options := metaV1.ListOptions{LabelSelector: selector.String()}
			manager.channel = GetContainerChannel(K8, d.Namespace, options, ds)
		default:
			return nil, errors.NewBadRequestError("dimension " + string(dimension.Dimension) + " not supported as a child of deployment")
		}
		output = append(output, manager)
	}
	return Extract(output)
}

func getDeploymentStatus(ready, total int) FleetStatus {
	if ready == total {
		return FleetStatus{
			Color:  GREEN_RGB,
			Value:  "Running",
			Reason: "",
		}
	} else if ready == 0 {
		return FleetStatus{
			Color:  RED_RGB,
			Value:  "Failed",
			Reason: "No running pods",
		}
	} else {
		return FleetStatus{
			Color:  YELLOW_RGB,
			Value:  "Waiting",
			Reason: fmt.Sprintf("%d/%d pods running", ready, total),
		}
	}
}

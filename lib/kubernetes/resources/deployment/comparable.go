package deployment

import (
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/types"
	v1 "k8s.io/api/apps/v1"
)

type deploymentComparable struct {
	deployment v1.Deployment
}

func (comp deploymentComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.deployment.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.deployment.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.deployment.CreationTimestamp.Time.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(events *v1.DeploymentList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, event := range events.Items {
		comps = append(comps, deploymentComparable{deployment: event})
	}
	return comps
}

func FromComparable(events []types.ComparableType) *v1.DeploymentList {
	list := []v1.Deployment{}
	for _, event := range events {
		list = append(list, event.(deploymentComparable).deployment)
	}
	return &v1.DeploymentList{
		Items: list,
	}
}

func CompareOnChannel(channel *channels.DeploymentListChannel, ds *types.DataSelector) (*v1.DeploymentList, error) {
	data := <-channel.List
	err := <-channel.Error
	if err != nil {
		return nil, err
	}
	depComps := ToComparable(data)
	ds.Execute(depComps)
	data = FromComparable(ds.Items)
	return data, nil
}

package pod

import (
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/types"
	v1 "k8s.io/api/core/v1"
)

type podComparable struct {
	pod v1.Pod
}

func (comp podComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.pod.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.pod.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.pod.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(pods *v1.PodList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, pod := range pods.Items {
		comps = append(comps, podComparable{pod: pod})
	}
	return comps
}

func FromComparable(pods []types.ComparableType) *v1.PodList {
	list := []v1.Pod{}
	for _, pod := range pods {
		list = append(list, pod.(podComparable).pod)
	}
	return &v1.PodList{
		Items: list,
	}
}

func CompareOnChannel(channel *channels.PodListChannel, ds *types.DataSelector) (*v1.PodList, error) {
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

package replicaset

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	apps "k8s.io/api/apps/v1"
)

type replicasetComparable struct {
	set apps.ReplicaSet
}

func (comp replicasetComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.set.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.set.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.set.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(sets *apps.ReplicaSetList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, set := range sets.Items {
		comps = append(comps, replicasetComparable{set: set})
	}
	return comps
}

func FromComparable(sets []types.ComparableType) *apps.ReplicaSetList {
	list := []apps.ReplicaSet{}
	for _, set := range sets {
		list = append(list, set.(replicasetComparable).set)
	}
	return &apps.ReplicaSetList{
		Items: list,
	}
}

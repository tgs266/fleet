package namespace

import (
	"github.com/tgs266/fleet/lib/types"
	v1 "k8s.io/api/core/v1"
)

type nsComparable struct {
	ns v1.Namespace
}

func (comp nsComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.ns.Name)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.ns.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func toComparable(namespaces *v1.NamespaceList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, ns := range namespaces.Items {
		comps = append(comps, nsComparable{ns: ns})
	}
	return comps
}

func fromComparable(namespaces []types.ComparableType) *v1.NamespaceList {
	list := []v1.Namespace{}
	for _, ns := range namespaces {
		list = append(list, ns.(nsComparable).ns)
	}
	return &v1.NamespaceList{
		Items: list,
	}
}

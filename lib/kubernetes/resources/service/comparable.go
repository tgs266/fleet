package service

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	v1 "k8s.io/api/core/v1"
)

type nsComparable struct {
	ns v1.Service
}

func (comp nsComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.ns.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.ns.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.ns.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func toComparable(services *v1.ServiceList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, ns := range services.Items {
		comps = append(comps, nsComparable{ns: ns})
	}
	return comps
}

func fromComparable(services []types.ComparableType) *v1.ServiceList {
	list := []v1.Service{}
	for _, ns := range services {
		list = append(list, ns.(nsComparable).ns)
	}
	return &v1.ServiceList{
		Items: list,
	}
}

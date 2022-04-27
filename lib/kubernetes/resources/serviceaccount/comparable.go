package serviceaccount

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	v1 "k8s.io/api/core/v1"
)

type saComparable struct {
	sa v1.ServiceAccount
}

func (comp saComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.sa.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.sa.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.sa.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(accounts *v1.ServiceAccountList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, sa := range accounts.Items {
		comps = append(comps, saComparable{sa: sa})
	}
	return comps
}

func FromComparable(accounts []types.ComparableType) *v1.ServiceAccountList {
	list := []v1.ServiceAccount{}
	for _, sa := range accounts {
		list = append(list, sa.(saComparable).sa)
	}
	return &v1.ServiceAccountList{
		Items: list,
	}
}

package rolebinding

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	rbac "k8s.io/api/rbac/v1"
)

type roleBindingComparable struct {
	roleBinding rbac.RoleBinding
}

func (comp roleBindingComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.roleBinding.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.roleBinding.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.roleBinding.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(roles *rbac.RoleBindingList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, roleBinding := range roles.Items {
		comps = append(comps, roleBindingComparable{roleBinding: roleBinding})
	}
	return comps
}

func FromComparable(roles []types.ComparableType) *rbac.RoleBindingList {
	list := []rbac.RoleBinding{}
	for _, role := range roles {
		list = append(list, role.(roleBindingComparable).roleBinding)
	}
	return &rbac.RoleBindingList{
		Items: list,
	}
}

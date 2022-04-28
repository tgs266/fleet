package clusterrolebinding

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	rbac "k8s.io/api/rbac/v1"
)

type clusterRoleBindingComparable struct {
	clusterRoleBinding rbac.ClusterRoleBinding
}

func (comp clusterRoleBindingComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.clusterRoleBinding.Name)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.clusterRoleBinding.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(roles *rbac.ClusterRoleBindingList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, clusterRoleBinding := range roles.Items {
		comps = append(comps, clusterRoleBindingComparable{clusterRoleBinding: clusterRoleBinding})
	}
	return comps
}

func FromComparable(roles []types.ComparableType) *rbac.ClusterRoleBindingList {
	list := []rbac.ClusterRoleBinding{}
	for _, role := range roles {
		list = append(list, role.(clusterRoleBindingComparable).clusterRoleBinding)
	}
	return &rbac.ClusterRoleBindingList{
		Items: list,
	}
}

package clusterrole

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	rbac "k8s.io/api/rbac/v1"
)

type clusterRoleComparable struct {
	clusterRole rbac.ClusterRole
}

func (comp clusterRoleComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.clusterRole.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.clusterRole.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.clusterRole.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(roles *rbac.ClusterRoleList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, role := range roles.Items {
		comps = append(comps, clusterRoleComparable{clusterRole: role})
	}
	return comps
}

func FromComparable(roles []types.ComparableType) *rbac.ClusterRoleList {
	list := []rbac.ClusterRole{}
	for _, role := range roles {
		list = append(list, role.(clusterRoleComparable).clusterRole)
	}
	return &rbac.ClusterRoleList{
		Items: list,
	}
}

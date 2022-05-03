package role

import (
	"github.com/tgs266/fleet/lib/types"
	rbac "k8s.io/api/rbac/v1"
)

type roleComparable struct {
	role rbac.Role
}

func (comp roleComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.role.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.role.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.role.CreationTimestamp.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(roles *rbac.RoleList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, role := range roles.Items {
		comps = append(comps, roleComparable{role: role})
	}
	return comps
}

func FromComparable(roles []types.ComparableType) *rbac.RoleList {
	list := []rbac.Role{}
	for _, role := range roles {
		list = append(list, role.(roleComparable).role)
	}
	return &rbac.RoleList{
		Items: list,
	}
}

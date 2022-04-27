package role

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	rbac "k8s.io/api/rbac/v1"
)

type RoleMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	Namespace   string            `json:"namespace"`
	CreatedAt   uint              `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
}

type Role struct {
	RoleMeta `json:",inline"`
	Rules    []rbac.PolicyRule `json:"rules"`
}

func BuildRoleMeta(role *rbac.Role) RoleMeta {
	return RoleMeta{
		Name:        role.Name,
		Namespace:   role.Namespace,
		CreatedAt:   uint(role.CreationTimestamp.UnixMilli()),
		UID:         string(role.UID),
		Labels:      role.Labels,
		Annotations: common.CleanAnnotations(role.GetAnnotations()),
	}
}

func BuildRole(role *rbac.Role) *Role {
	meta := BuildRoleMeta(role)
	return &Role{
		RoleMeta: meta,
		Rules:    role.Rules,
	}
}

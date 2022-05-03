package clusterrole

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	rbac "k8s.io/api/rbac/v1"
)

type ClusterRoleMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	CreatedAt   uint              `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
}

type ClusterRole struct {
	ClusterRoleMeta `json:",inline"`
	Rules           []rbac.PolicyRule `json:"rules"`
}

func BuildClusterRoleMeta(role *rbac.ClusterRole) ClusterRoleMeta {
	return ClusterRoleMeta{
		Name:        role.Name,
		CreatedAt:   uint(role.CreationTimestamp.UnixMilli()),
		UID:         string(role.UID),
		Labels:      role.Labels,
		Annotations: common.CleanAnnotations(role.GetAnnotations()),
	}
}

func BuildClusterRole(role *rbac.ClusterRole) *ClusterRole {
	meta := BuildClusterRoleMeta(role)
	return &ClusterRole{
		ClusterRoleMeta: meta,
		Rules:           role.Rules,
	}
}

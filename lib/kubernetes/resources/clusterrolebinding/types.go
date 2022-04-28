package clusterrolebinding

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	rbac "k8s.io/api/rbac/v1"
)

type ClusterRoleBindingMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	CreatedAt   uint              `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
	RoleName    string            `json:"roleName"`
}

type ClusterRoleBinding struct {
	ClusterRoleBindingMeta `json:",inline"`
	Subjects               []rbac.Subject `json:"subjects"`
}

func BuildClusterRoleBindingMeta(binding *rbac.ClusterRoleBinding) ClusterRoleBindingMeta {
	return ClusterRoleBindingMeta{
		Name:        binding.Name,
		CreatedAt:   uint(binding.CreationTimestamp.UnixMilli()),
		UID:         string(binding.UID),
		Labels:      binding.Labels,
		Annotations: common.CleanAnnotations(binding.GetAnnotations()),
		RoleName:    binding.RoleRef.Name,
	}
}

func BuildClusterRoleBinding(binding *rbac.ClusterRoleBinding) *ClusterRoleBinding {
	meta := BuildClusterRoleBindingMeta(binding)
	return &ClusterRoleBinding{
		ClusterRoleBindingMeta: meta,
		Subjects:               binding.Subjects,
	}
}

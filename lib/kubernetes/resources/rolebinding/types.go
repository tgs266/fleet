package rolebinding

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	rbac "k8s.io/api/rbac/v1"
)

type RoleBindingMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	Namespace   string            `json:"namespace"`
	CreatedAt   uint              `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
}

type RoleBinding struct {
	RoleBindingMeta `json:",inline"`
	Subjects        []rbac.Subject `json:"rules"`
}

func BuildRoleBindingMeta(binding *rbac.RoleBinding) RoleBindingMeta {
	return RoleBindingMeta{
		Name:        binding.Name,
		Namespace:   binding.Namespace,
		CreatedAt:   uint(binding.CreationTimestamp.UnixMilli()),
		UID:         string(binding.UID),
		Labels:      binding.Labels,
		Annotations: common.CleanAnnotations(binding.GetAnnotations()),
	}
}

func BuildRoleBinding(binding *rbac.RoleBinding) *RoleBinding {
	meta := BuildRoleBindingMeta(binding)
	return &RoleBinding{
		RoleBindingMeta: meta,
		Subjects:        binding.Subjects,
	}
}

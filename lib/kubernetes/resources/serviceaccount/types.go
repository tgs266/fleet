package serviceaccount

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	"github.com/tgs266/fleet/lib/kubernetes/resources/clusterrolebinding"
	"github.com/tgs266/fleet/lib/kubernetes/resources/rolebinding"
	v1 "k8s.io/api/core/v1"
	rbac "k8s.io/api/rbac/v1"
)

type ServiceAccountMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	Namespace   string            `json:"namespace"`
	CreatedAt   uint              `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
}

type ServiceAccount struct {
	ServiceAccountMeta  `json:",inline"`
	RoleBindings        []rolebinding.RoleBindingMeta               `json:"roleBindings"`
	ClusterRoleBindings []clusterrolebinding.ClusterRoleBindingMeta `json:"clusterRoleBindings"`
}

func BuildServiceAccountMeta(sa *v1.ServiceAccount) ServiceAccountMeta {
	return ServiceAccountMeta{
		Name:        sa.Name,
		Namespace:   sa.Namespace,
		CreatedAt:   uint(sa.CreationTimestamp.UnixMilli()),
		UID:         string(sa.UID),
		Labels:      sa.Labels,
		Annotations: common.CleanAnnotations(sa.GetAnnotations()),
	}
}

func BuildServiceAccount(sa *v1.ServiceAccount, roleBindings *rbac.RoleBindingList, clusterRoleBindings *rbac.ClusterRoleBindingList) *ServiceAccount {
	meta := BuildServiceAccountMeta(sa)

	roleBindingMetas := []rolebinding.RoleBindingMeta{}
	for _, item := range roleBindings.Items {
		roleBindingMetas = append(roleBindingMetas, rolebinding.BuildRoleBindingMeta(&item))
	}
	clusterRoleBindingMetas := []clusterrolebinding.ClusterRoleBindingMeta{}
	for _, item := range clusterRoleBindings.Items {
		clusterRoleBindingMetas = append(clusterRoleBindingMetas, clusterrolebinding.BuildClusterRoleBindingMeta(&item))
	}

	return &ServiceAccount{
		ServiceAccountMeta:  meta,
		RoleBindings:        roleBindingMetas,
		ClusterRoleBindings: clusterRoleBindingMetas,
	}
}

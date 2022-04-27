package serviceaccount

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	v1 "k8s.io/api/core/v1"
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
	ServiceAccountMeta `json:",inline"`
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

func BuildServiceAccount(sa *v1.ServiceAccount) *ServiceAccount {
	meta := BuildServiceAccountMeta(sa)
	return &ServiceAccount{
		ServiceAccountMeta: meta,
	}
}

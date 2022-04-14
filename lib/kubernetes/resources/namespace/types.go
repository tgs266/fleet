package namespace

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	v1 "k8s.io/api/core/v1"
)

type NamespaceMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	CreatedAt   int64             `json:"createdAt"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
	Status      string            `json:"status"`
}

func BuildNamespaceMeta(ns *v1.Namespace) *NamespaceMeta {
	return &NamespaceMeta{
		UID:         string(ns.UID),
		Name:        ns.Name,
		CreatedAt:   ns.CreationTimestamp.UnixMilli(),
		Labels:      ns.Labels,
		Annotations: common.CleanAnnotations(ns.Annotations),
		Status:      string(ns.Status.Phase),
	}
}

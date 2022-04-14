package condition

import (
	v1a "k8s.io/api/apps/v1"
	v1 "k8s.io/api/core/v1"
)

type Condition struct {
	Type               string `json:"type"`
	Status             string `json:"status"`
	LastProbeTime      int64  `json:"lastProbeTime,omitempty"`
	LastTransitionTime int64  `json:"lastTransitionTime,omitempty"`
	Reason             string `json:"reason"`
	Message            string `json:"message"`
}

func BuildFromPodCondition(cond v1.PodCondition) Condition {
	return Condition{
		Type:               string(cond.Type),
		Status:             string(cond.Status),
		LastProbeTime:      cond.LastProbeTime.UnixMilli(),
		LastTransitionTime: cond.LastTransitionTime.UnixMilli(),
		Reason:             cond.Reason,
		Message:            cond.Message,
	}
}

func BuildFromDeploymentCondition(cond v1a.DeploymentCondition) Condition {
	return Condition{
		Type:               string(cond.Type),
		Status:             string(cond.Status),
		LastTransitionTime: cond.LastTransitionTime.UnixMilli(),
		Reason:             cond.Reason,
		Message:            cond.Message,
	}
}

func BuildFromNamespaceCondition(cond v1.NamespaceCondition) Condition {
	return Condition{
		Type:               string(cond.Type),
		Status:             string(cond.Status),
		LastTransitionTime: cond.LastTransitionTime.UnixMilli(),
		Reason:             cond.Reason,
		Message:            cond.Message,
	}
}

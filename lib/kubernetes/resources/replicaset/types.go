package replicaset

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	apps "k8s.io/api/apps/v1"
	core "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type ReplicaSetMeta struct {
	UID           string            `json:"uid"`
	Name          string            `json:"name"`
	Namespace     string            `json:"namespace"`
	CreatedAt     uint              `json:"createdAt"`
	Labels        map[string]string `json:"labels"`
	Annotations   map[string]string `json:"annotations"`
	ReadyReplicas int32             `json:"readyReplicas"`
	Replicas      int32             `json:"replicas"`
	Owners        []Owner           `json:"owners"`
}

type ReplicaSet struct {
	ReplicaSetMeta `json:",inline"`
	Pods           []pod.Pod         `json:"pods"`
	Tolerances     []core.Toleration `json:"tolerances"`
}

type Owner struct {
	Name string `json:"name"`
	Kind string `json:"kind"`
}

func filterPods(owner metaV1.Object, allPods []core.Pod) []pod.Pod {
	var matchingPods []pod.Pod
	for _, p := range allPods {
		if metaV1.IsControlledBy(&p, owner) {
			matchingPods = append(matchingPods, *pod.BuildPod(&p, nil))
		}
	}
	return matchingPods
}

func BuildReplicaSetMeta(replicaset *apps.ReplicaSet) ReplicaSetMeta {

	owners := []Owner{}
	for _, o := range replicaset.OwnerReferences {
		owners = append(owners, Owner{
			Name: o.Name,
			Kind: o.Kind,
		})
	}

	return ReplicaSetMeta{
		UID:           string(replicaset.UID),
		Name:          replicaset.Name,
		Namespace:     replicaset.Namespace,
		CreatedAt:     uint(replicaset.CreationTimestamp.UnixMilli()),
		Labels:        replicaset.Labels,
		Annotations:   common.CleanAnnotations(replicaset.Annotations),
		Replicas:      replicaset.Status.Replicas,
		ReadyReplicas: replicaset.Status.ReadyReplicas,
		Owners:        owners,
	}
}

func BuildReplicaSet(replicaset *apps.ReplicaSet, pods core.PodList) *ReplicaSet {
	return &ReplicaSet{
		ReplicaSetMeta: BuildReplicaSetMeta(replicaset),
		Pods:           filterPods(replicaset, pods.Items),
		Tolerances:     replicaset.Spec.Template.Spec.Tolerations,
	}
}

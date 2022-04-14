package deployment

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	"github.com/tgs266/fleet/lib/kubernetes/resources/condition"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/resources/service"
	v1 "k8s.io/api/apps/v1"
	v1c "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

type DeploymentMeta struct {
	UID           string            `json:"uid"`
	Name          string            `json:"name"`
	Namespace     string            `json:"namespace"`
	CreatedAt     int64             `json:"createdAt"`
	ReadyReplicas int               `json:"readyReplicas"`
	Replicas      int               `json:"replicas"`
	Labels        map[string]string `json:"labels"`
	Annotations   map[string]string `json:"annotations"`
	Selector      string            `json:"selector"`
}

type Deployment struct {
	DeploymentMeta `json:",inline"`
	Pods           []pod.Pod                 `json:"pods"`
	ContainerSpecs []container.ContainerSpec `json:"containerSpecs"`
	Services       []service.ServiceMeta     `json:"services"`
	ContainerCount int                       `json:"containerCount"`
	Conditions     []condition.Condition     `json:"conditions"`
}

type DeploymentCreation struct {
	Name           string                    `json:"name"`
	Namespace      string                    `json:"namespace"`
	ContainerSpecs []container.ContainerSpec `json:"containerSpecs"`
	Replicas       int                       `json:"replicas"`
}

type UpdateAppBody struct {
	Pause    *bool `json:"pause"`
	Replicas *int  `json:"replicas"`
}

func BuildDeploymentMeta(dep *v1.Deployment) DeploymentMeta {
	annotations := common.CleanAnnotations(dep.GetAnnotations())
	selector, _ := metaV1.LabelSelectorAsSelector(dep.Spec.Selector)

	return DeploymentMeta{
		Name:          dep.Name,
		Namespace:     dep.Namespace,
		UID:           string(dep.UID),
		CreatedAt:     dep.CreationTimestamp.Time.UnixMilli(),
		ReadyReplicas: int(dep.Status.ReadyReplicas),
		Replicas:      int(*dep.Spec.Replicas),
		Annotations:   annotations,
		Labels:        dep.Labels,
		Selector:      selector.String(),
	}
}

func BuildDeployment(dep *v1.Deployment, svcs *v1c.ServiceList, pods *v1c.PodList, podMets *v1beta1.PodMetricsList) *Deployment {

	extractedPodMets := pod.ExtractPodMetrics(podMets)

	decodedPods := []pod.Pod{}
	decodedSpecs := []container.ContainerSpec{}
	decodedSvcs := []service.ServiceMeta{}
	for _, p := range pods.Items {
		decodedPods = append(decodedPods, *pod.BuildPod(&p, extractedPodMets[p.Name]))
	}

	for _, spec := range dep.Spec.Template.Spec.Containers {
		decodedSpecs = append(decodedSpecs, container.BuildContainerSpec(spec))
	}

	for _, svc := range svcs.Items {
		decodedSvcs = append(decodedSvcs, *service.BuildServiceMeta(&svc))
	}

	conds := []condition.Condition{}
	for _, c := range dep.Status.Conditions {
		conds = append(conds, condition.BuildFromDeploymentCondition(c))
	}

	d := &Deployment{
		DeploymentMeta: BuildDeploymentMeta(dep),
		ContainerCount: len(dep.Spec.Template.Spec.Containers),
		Pods:           decodedPods,
		ContainerSpecs: decodedSpecs,
		Services:       decodedSvcs,
		Conditions:     conds,
	}

	return d
}

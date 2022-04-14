package service

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	"github.com/tgs266/fleet/lib/kubernetes/resources/endpoint"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	v1 "k8s.io/api/core/v1"
)

type ServiceMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	Namespace   string            `json:"namespace"`
	Type        string            `json:"type"`
	CreatedAt   int64             `json:"createdAt"`
	Ports       []v1.ServicePort  `json:"ports"`
	Annotations map[string]string `json:"annotations"`
	Labels      map[string]string `json:"labels"`
}

type Service struct {
	ServiceMeta `json:",inline"`

	ClusterIP string            `json:"clusterIp"`
	Selector  map[string]string `json:"selector"`

	Pods      []pod.Pod            `json:"pods"`
	Endpoints []*endpoint.Endpoint `json:"endpoints"`
}

func BuildServiceMeta(service *v1.Service) *ServiceMeta {
	return &ServiceMeta{
		UID:         string(service.UID),
		Name:        service.Name,
		Namespace:   service.Namespace,
		Type:        string(service.Spec.Type),
		CreatedAt:   service.CreationTimestamp.UnixMilli(),
		Ports:       service.Spec.Ports,
		Annotations: common.CleanAnnotations(service.GetAnnotations()),
		Labels:      service.Labels,
	}
}

func BuildService(service *v1.Service, pods *v1.PodList, endpoints *v1.EndpointsList) *Service {

	decodedPods := []pod.Pod{}
	if pods != nil {
		for _, p := range pods.Items {
			decodedPods = append(decodedPods, *pod.BuildPod(&p, nil))
		}
	}

	decodedEndpoints := []*endpoint.Endpoint{}
	if endpoints != nil {
		decodedEndpoints = endpoint.BuildEndpoints(endpoints.Items)
	}

	return &Service{
		ServiceMeta: *BuildServiceMeta(service),

		Selector:  service.Spec.Selector,
		ClusterIP: service.Spec.ClusterIP,

		Pods:      decodedPods,
		Endpoints: decodedEndpoints,
	}
}

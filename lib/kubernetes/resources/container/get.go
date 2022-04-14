package container

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func GetPodContainer(K8 *kubernetes.K8Client, namespace string, name string, containerName string) (*Container, error) {
	podMetrics := channels.GetPodMetricsChannel(K8.Metrics, namespace, metaV1.ListOptions{}, 1)
	p, err := K8.K8.CoreV1().Pods(namespace).Get(context.TODO(), name, metaV1.GetOptions{})
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	podMets := <-podMetrics.List
	extractedContainerMets := ExtractContainerMetrics(podMets, name, containerName)

	for c := range p.Spec.Containers {
		cont := p.Spec.Containers[c]
		if cont.Name == containerName {
			return BuildContainer(cont, extractedContainerMets, p.Status.ContainerStatuses[c].State), nil
		}
	}
	return nil, errors.NewResourceNotFoundError("container", containerName)
}

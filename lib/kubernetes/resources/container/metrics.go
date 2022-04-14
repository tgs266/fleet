package container

import "k8s.io/metrics/pkg/apis/metrics/v1beta1"

func ExtractContainerMetrics(podMets *v1beta1.PodMetricsList, podName string, containerName string) *v1beta1.ContainerMetrics {
	if podMets == nil {
		return nil
	}
	for _, m := range podMets.Items {
		if m.Name == podName {
			for _, c := range m.Containers {
				if c.Name == containerName {
					return &c
				}
			}
		}
	}
	return nil
}

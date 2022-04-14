package pod

import "k8s.io/metrics/pkg/apis/metrics/v1beta1"

func ExtractPodMetrics(podMets *v1beta1.PodMetricsList) map[string]*v1beta1.PodMetrics {
	if podMets == nil {
		return map[string]*v1beta1.PodMetrics{}
	}
	r := map[string]*v1beta1.PodMetrics{}
	for _, m := range podMets.Items {
		r[m.Name] = &m
	}
	return r
}

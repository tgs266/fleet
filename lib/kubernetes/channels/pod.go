package channels

import (
	"context"

	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
	metrics "k8s.io/metrics/pkg/client/clientset/versioned"
)

type PodListChannel struct {
	List  chan *v1.PodList
	Error chan error
}

type PodMetricListChannel struct {
	List chan *v1beta1.PodMetricsList
}

func GetPodListChannel(client kubernetes.Interface, namespace string, options metaV1.ListOptions, numReads int) *PodListChannel {
	channel := &PodListChannel{
		List:  make(chan *v1.PodList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.CoreV1().Pods(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

func GetPodMetricsChannel(metricClient *metrics.Clientset, namespace string, options metaV1.ListOptions, numReads int) *PodMetricListChannel {
	channel := &PodMetricListChannel{
		List: make(chan *v1beta1.PodMetricsList, numReads),
	}

	if metricClient != nil {
		go func() {
			// we dont care about the metrics error
			list, _ := metricClient.MetricsV1beta1().PodMetricses(namespace).List(context.TODO(), options)
			for i := 0; i < numReads; i++ {
				channel.List <- list
			}
		}()
	} else {
		channel.List <- new(v1beta1.PodMetricsList)
	}
	return channel
}

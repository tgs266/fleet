package channels

import (
	"context"

	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type ServiceListChannel struct {
	List  chan *v1.ServiceList
	Error chan error
}

func GetServiceListChannel(client *kubernetes.Clientset, namespace string, options metaV1.ListOptions, numReads int) *ServiceListChannel {
	channel := &ServiceListChannel{
		List:  make(chan *v1.ServiceList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.CoreV1().Services(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

package channels

import (
	"context"

	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type ServiceAccountListChannel struct {
	List  chan *v1.ServiceAccountList
	Error chan error
}

func GetServiceAccountListChannel(client kubernetes.Interface, namespace string, options metaV1.ListOptions, numReads int) *ServiceAccountListChannel {
	channel := &ServiceAccountListChannel{
		List:  make(chan *v1.ServiceAccountList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.CoreV1().ServiceAccounts(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

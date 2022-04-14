package channels

import (
	"context"

	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type NamespaceListChannel struct {
	List  chan *v1.NamespaceList
	Error chan error
}

func GetNamespaceListChannel(client *kubernetes.Clientset, options metaV1.ListOptions, numReads int) *NamespaceListChannel {
	channel := &NamespaceListChannel{
		List:  make(chan *v1.NamespaceList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.CoreV1().Namespaces().List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

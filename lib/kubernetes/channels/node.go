package channels

import (
	"context"

	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type NodeListChannel struct {
	List  chan *v1.NodeList
	Error chan error
}

func GetNodeListChannel(client *kubernetes.Clientset, options metaV1.ListOptions, numReads int) *NodeListChannel {
	channel := &NodeListChannel{
		List:  make(chan *v1.NodeList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.CoreV1().Nodes().List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

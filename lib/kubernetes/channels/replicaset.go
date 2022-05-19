package channels

import (
	"context"

	apps "k8s.io/api/apps/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type ReplicaSetListChannel struct {
	List  chan *apps.ReplicaSetList
	Error chan error
}

func GetReplicaSetListChannel(client kubernetes.Interface, namespace string, options metaV1.ListOptions, numReads int) *ReplicaSetListChannel {
	channel := &ReplicaSetListChannel{
		List:  make(chan *apps.ReplicaSetList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.AppsV1().ReplicaSets(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

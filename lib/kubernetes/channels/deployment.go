package channels

import (
	"context"

	v1 "k8s.io/api/apps/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type DeploymentListChannel struct {
	List  chan *v1.DeploymentList
	Error chan error
}

func GetDeploymentListChannel(client *kubernetes.Clientset, namespace string, options metaV1.ListOptions, numReads int) *DeploymentListChannel {
	channel := &DeploymentListChannel{
		List:  make(chan *v1.DeploymentList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.AppsV1().Deployments(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

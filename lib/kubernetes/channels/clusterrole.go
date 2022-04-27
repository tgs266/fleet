package channels

import (
	"context"

	rbac "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type ClusterRoleListChannel struct {
	List  chan *rbac.ClusterRoleList
	Error chan error
}

func GetClusterRoleListChannel(client kubernetes.Interface, options metaV1.ListOptions, numReads int) *ClusterRoleListChannel {
	channel := &ClusterRoleListChannel{
		List:  make(chan *rbac.ClusterRoleList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.RbacV1().ClusterRoles().List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

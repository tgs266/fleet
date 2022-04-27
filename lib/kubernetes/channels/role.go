package channels

import (
	"context"

	rbac "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type RoleListChannel struct {
	List  chan *rbac.RoleList
	Error chan error
}

func GetRoleListChannel(client kubernetes.Interface, namespace string, options metaV1.ListOptions, numReads int) *RoleListChannel {
	channel := &RoleListChannel{
		List:  make(chan *rbac.RoleList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.RbacV1().Roles(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

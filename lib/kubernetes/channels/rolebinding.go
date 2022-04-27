package channels

import (
	"context"

	rbac "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type RoleBindingListChannel struct {
	List  chan *rbac.RoleBindingList
	Error chan error
}

func GetRoleBindingListChannel(client kubernetes.Interface, namespace string, options metaV1.ListOptions, numReads int) *RoleBindingListChannel {
	channel := &RoleBindingListChannel{
		List:  make(chan *rbac.RoleBindingList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.RbacV1().RoleBindings(namespace).List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

package channels

import (
	"context"

	coreV1 "k8s.io/api/core/v1"
	rbac "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

type ClusterRoleBindingListChannel struct {
	List  chan *rbac.ClusterRoleBindingList
	Error chan error
}

func GetClusterRoleBindingListChannel(client kubernetes.Interface, options metaV1.ListOptions, numReads int) *ClusterRoleBindingListChannel {
	channel := &ClusterRoleBindingListChannel{
		List:  make(chan *rbac.ClusterRoleBindingList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.RbacV1().ClusterRoleBindings().List(context.TODO(), options)
		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

func GetClusterRoleBindingListChannelForServiceAccount(client kubernetes.Interface, serviceAccount *coreV1.ServiceAccount, options metaV1.ListOptions, numReads int) *ClusterRoleBindingListChannel {
	channel := &ClusterRoleBindingListChannel{
		List:  make(chan *rbac.ClusterRoleBindingList, numReads),
		Error: make(chan error, numReads),
	}

	go func() {
		list, err := client.RbacV1().ClusterRoleBindings().List(context.TODO(), options)

		newList := []rbac.ClusterRoleBinding{}
		for _, item := range list.Items {
			for _, subject := range item.Subjects {
				if subject.Name == serviceAccount.Name && subject.Namespace == serviceAccount.Namespace {
					newList = append(newList, item)
					break
				}
			}
		}

		list = &rbac.ClusterRoleBindingList{
			Items: newList,
		}

		for i := 0; i < numReads; i++ {
			channel.List <- list
			channel.Error <- err
		}
	}()
	return channel
}

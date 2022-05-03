package serviceaccount

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	v1 "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Get(K8 *kubernetes.K8Client, namespace string, name string) (*ServiceAccount, error) {
	sa, err := K8.K8.CoreV1().ServiceAccounts(namespace).Get(context.Background(), name, metaV1.GetOptions{})
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	// allow compare on channel eventually (for sorting in a table)
	roleBindingChannel := channels.GetRoleBindingListChannelForServiceAccount(K8.K8, namespace, sa, metaV1.ListOptions{}, 1)
	clusterRoleBindingChannel := channels.GetClusterRoleBindingListChannelForServiceAccount(K8.K8, sa, metaV1.ListOptions{}, 1)

	bindings := <-roleBindingChannel.List
	err = <-roleBindingChannel.Error

	if err != nil {
		bindings = &v1.RoleBindingList{
			Items: []v1.RoleBinding{},
		}
	}

	cBindings := <-clusterRoleBindingChannel.List
	err = <-clusterRoleBindingChannel.Error

	if err != nil {
		cBindings = &v1.ClusterRoleBindingList{
			Items: []v1.ClusterRoleBinding{},
		}
	}

	return BuildServiceAccount(sa, bindings, cBindings), nil
}

package rolebinding

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Get(K8 *kubernetes.K8Client, namespace, name string) (*RoleBinding, error) {
	binding, err := K8.K8.RbacV1().RoleBindings(namespace).Get(context.Background(), name, metaV1.GetOptions{})
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}
	return BuildRoleBinding(binding), nil
}

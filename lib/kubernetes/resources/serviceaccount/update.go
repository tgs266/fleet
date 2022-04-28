package serviceaccount

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	v1 "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func ConnectToRoleBinding(K8 *kubernetes.K8Client, namespace, name string, saBindRequest BindRequest) error {
	sa, err := K8.K8.CoreV1().ServiceAccounts(namespace).Get(context.Background(), name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding, err := K8.K8.RbacV1().RoleBindings(saBindRequest.TargetRoleNamespace).Get(context.Background(), saBindRequest.TargetRoleName, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding.Subjects = append(binding.Subjects, v1.Subject{
		Name:      sa.Name,
		Namespace: sa.Namespace,
		Kind:      "ServiceAccount",
	})

	_, err = K8.K8.RbacV1().RoleBindings(namespace).Update(context.Background(), binding, metaV1.UpdateOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return nil
}

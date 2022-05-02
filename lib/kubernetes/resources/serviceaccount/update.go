package serviceaccount

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	v1 "k8s.io/api/rbac/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func cleanSubjects(name, namespace string, subjects []v1.Subject) []v1.Subject {
	newList := []v1.Subject{}
	for _, s := range subjects {
		if s.Name != name {
			if namespace == "" || namespace != s.Namespace {
				newList = append(newList, s)
			}
		}
	}
	return newList
}

func DisconnectRoleBinding(K8 *kubernetes.K8Client, namespace, name string, saBindRequest BindRequest) error {
	sa, err := K8.K8.CoreV1().ServiceAccounts(namespace).Get(context.Background(), name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding, err := K8.K8.RbacV1().RoleBindings(saBindRequest.TargetRoleNamespace).Get(context.Background(), saBindRequest.TargetRoleName, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding.Subjects = cleanSubjects(sa.Name, sa.Namespace, binding.Subjects)

	_, err = K8.K8.RbacV1().RoleBindings(namespace).Update(context.Background(), binding, metaV1.UpdateOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return nil
}

func DisconnectClusterRoleBinding(K8 *kubernetes.K8Client, namespace, name string, saBindRequest BindRequest) error {
	sa, err := K8.K8.CoreV1().ServiceAccounts(namespace).Get(context.Background(), name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding, err := K8.K8.RbacV1().ClusterRoleBindings().Get(context.Background(), saBindRequest.TargetRoleName, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding.Subjects = cleanSubjects(sa.Name, sa.Namespace, binding.Subjects)

	_, err = K8.K8.RbacV1().ClusterRoleBindings().Update(context.Background(), binding, metaV1.UpdateOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return nil
}

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

func ConnectToClusterRoleBinding(K8 *kubernetes.K8Client, namespace, name string, saBindRequest BindRequest) error {
	sa, err := K8.K8.CoreV1().ServiceAccounts(namespace).Get(context.Background(), name, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding, err := K8.K8.RbacV1().ClusterRoleBindings().Get(context.Background(), saBindRequest.TargetRoleName, metaV1.GetOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}

	binding.Subjects = append(binding.Subjects, v1.Subject{
		Name:      sa.Name,
		Namespace: sa.Namespace,
		Kind:      "ServiceAccount",
	})

	_, err = K8.K8.RbacV1().ClusterRoleBindings().Update(context.Background(), binding, metaV1.UpdateOptions{})
	if err != nil {
		return errors.ParseInternalError(err)
	}
	return nil
}

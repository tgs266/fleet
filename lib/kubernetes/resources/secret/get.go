package secret

import (
	"context"

	"github.com/tgs266/fleet/lib/kubernetes"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Get(K8 *kubernetes.K8Client, namespace string, name string) (*Secret, error) {
	secret, err := K8.K8.CoreV1().Secrets(namespace).Get(context.TODO(), name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return BuildSecret(secret), nil
}

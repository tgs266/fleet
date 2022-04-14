package pod

import (
	"context"

	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/logging"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Delete(K8 *kubernetes.K8Client, namespace string, name string) error {
	logging.INFOf("deleting pod %s/%s", namespace, name)
	return K8.K8.CoreV1().Pods(namespace).Delete(context.TODO(), name, metaV1.DeleteOptions{})
}

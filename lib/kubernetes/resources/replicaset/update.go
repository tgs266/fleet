package replicaset

import (
	"context"
	"time"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Restart(K8 *kubernetes.K8Client, namespace string, name string) error {
	set, err := K8.K8.AppsV1().ReplicaSets(namespace).Get(context.TODO(), name, metaV1.GetOptions{})
	if err != nil {
		return err
	}

	if set.Spec.Template.ObjectMeta.Annotations == nil {
		set.Spec.Template.ObjectMeta.Annotations = make(map[string]string, 0)
	}
	set.Spec.Template.ObjectMeta.Annotations["kubectl.kubernetes.io/restartedAt"] = time.Now().Format(time.RFC3339)
	_, err = K8.K8.AppsV1().ReplicaSets(namespace).Update(context.Background(), set, metaV1.UpdateOptions{})
	return errors.ParseInternalError(err)
}

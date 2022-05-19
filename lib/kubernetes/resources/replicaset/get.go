package replicaset

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func Get(K8 *kubernetes.K8Client, namespace string, name string) (*ReplicaSet, error) {

	podChannel := channels.GetPodListChannel(K8.K8, namespace, v1.ListOptions{}, 1)

	set, err := K8.K8.AppsV1().ReplicaSets(namespace).Get(context.TODO(), name, v1.GetOptions{})
	if err != nil {
		return nil, err
	}

	pods := <-podChannel.List
	err = <-podChannel.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	return BuildReplicaSet(set, *pods), nil
}

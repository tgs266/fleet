package node

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/fields"
)

func List(K8 *kubernetes.K8Client) ([]NodeMeta, error) {
	nodeChannelList := channels.GetNodeListChannel(K8.K8, metaV1.ListOptions{}, 1)

	nodes := <-nodeChannelList.List
	err := <-nodeChannelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	resp := []NodeMeta{}
	for _, node := range nodes.Items {
		fieldSelector, err := fields.ParseSelector("spec.nodeName=" + node.Name +
			",status.phase!=" + string(v1.PodSucceeded) +
			",status.phase!=" + string(v1.PodFailed))
		if err != nil {
			return nil, errors.ParseInternalError(err)
		}

		podChannelList := channels.GetPodListChannel(K8.K8, "", metaV1.ListOptions{FieldSelector: fieldSelector.String()}, 1)
		pods := <-podChannelList.List
		err = <-podChannelList.Error
		if err != nil {
			pods := new(v1.PodList)
			pods.Items = make([]v1.Pod, 0)
		}
		resp = append(resp, *BuildNodeMeta(&node, pods))
	}
	return resp, nil
}

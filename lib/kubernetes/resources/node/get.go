package node

import (
	"context"
	"strings"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/fields"
)

func Get(K8 *kubernetes.K8Client, name string, dataSelector *types.DataSelector) (*Node, error) {
	node, err := K8.K8.CoreV1().Nodes().Get(context.TODO(), name, metaV1.GetOptions{})

	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	return finalizeNodeBuild(K8, dataSelector, node)
}

func GetMaster(K8 *kubernetes.K8Client, dataSelector *types.DataSelector) (*Node, error) {
	nodes, err := K8.K8.CoreV1().Nodes().List(context.TODO(), metaV1.ListOptions{})

	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	var node *v1.Node
	for _, n := range nodes.Items {
		for l, _ := range n.Labels {
			if strings.Contains(l, "roles") && strings.Contains(l, "master") {
				node = &n
				break
			}
		}
	}

	if node == nil {
		return nil, errors.CreateError(404, "could not find master node")
	}
	return finalizeNodeBuild(K8, dataSelector, node)
}

func finalizeNodeBuild(K8 *kubernetes.K8Client, dataSelector *types.DataSelector, node *v1.Node) (*Node, error) {
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

	podComps := pod.ToComparable(pods)
	dataSelector.Execute(podComps)
	queriedPods := pod.FromComparable(dataSelector.Items)

	return BuildNode(node, pods, queriedPods, dataSelector), nil
}

package replicaset

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func List(K8 *kubernetes.K8Client, namespace string, selector *types.DataSelector) (*types.PaginationResponse, error) {
	channelList := channels.GetReplicaSetListChannel(K8.K8, namespace, metaV1.ListOptions{}, 1)

	list := <-channelList.List
	err := <-channelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	if selector != nil {
		comps := ToComparable(list)
		selector.Execute(comps)
		list = FromComparable(selector.Items)
	}

	items := []ReplicaSetMeta{}
	for _, role := range list.Items {
		items = append(items, BuildReplicaSetMeta(&role))
	}
	resp := &types.PaginationResponse{
		Items: items,
		Count: len(items),
	}

	if selector != nil {
		resp.Total = selector.TotalItemCount
		resp.Offset = selector.Offset
	} else {
		resp.Total = resp.Count
		resp.Offset = 0
	}

	return resp, nil
}

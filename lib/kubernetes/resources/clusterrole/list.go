package clusterrole

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func List(K8 *kubernetes.K8Client, selector *types.DataSelector) (*types.PaginationResponse, error) {
	clusterRoleChannelList := channels.GetClusterRoleListChannel(K8.K8, metaV1.ListOptions{}, 1)

	roles := <-clusterRoleChannelList.List
	err := <-clusterRoleChannelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	if selector != nil {
		comps := ToComparable(roles)
		selector.Execute(comps)
		roles = FromComparable(selector.Items)
	}

	items := []ClusterRoleMeta{}
	for _, role := range roles.Items {
		items = append(items, BuildClusterRoleMeta(&role))
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

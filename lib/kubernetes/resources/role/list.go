package role

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func List(K8 *kubernetes.K8Client, namespace string, selector *types.DataSelector) (*types.PaginationResponse, error) {
	roleChannelList := channels.GetRoleListChannel(K8.K8, namespace, metaV1.ListOptions{}, 1)

	roles := <-roleChannelList.List
	err := <-roleChannelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	if selector != nil {
		comps := ToComparable(roles)
		selector.Execute(comps)
		roles = FromComparable(selector.Items)
	}

	items := []RoleMeta{}
	for _, role := range roles.Items {
		items = append(items, BuildRoleMeta(&role))
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

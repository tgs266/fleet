package serviceaccount

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func List(K8 *kubernetes.K8Client, namespace string, selector *types.DataSelector) (*types.PaginationResponse, error) {
	saChannelList := channels.GetServiceAccountListChannel(K8.K8, namespace, metaV1.ListOptions{}, 1)

	serviceAccounts := <-saChannelList.List
	err := <-saChannelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	if selector != nil {
		saComps := ToComparable(serviceAccounts)
		selector.Execute(saComps)
		serviceAccounts = FromComparable(selector.Items)
	}

	items := []ServiceAccountMeta{}
	for _, sa := range serviceAccounts.Items {
		items = append(items, BuildServiceAccountMeta(&sa))
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

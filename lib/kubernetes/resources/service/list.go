package service

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func List(K8 *kubernetes.K8Client, namespace string, selector *types.DataSelector) (*types.PaginationResponse, error) {
	serviceChannelList := channels.GetServiceListChannel(K8.K8, namespace, metaV1.ListOptions{}, 1)

	svcs := <-serviceChannelList.List
	err := <-serviceChannelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	comps := toComparable(svcs)
	selector.Execute(comps)
	svcs = fromComparable(selector.Items)

	metas := []ServiceMeta{}
	for _, svc := range svcs.Items {
		metas = append(metas, *BuildServiceMeta(&svc))
	}

	resp := &types.PaginationResponse{
		Items:  metas,
		Count:  len(metas),
		Total:  selector.TotalItemCount,
		Offset: selector.Offset,
	}

	return resp, nil
}

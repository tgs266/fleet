package pod

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func ListStubs(K8 *kubernetes.K8Client, namespace string, selector *types.DataSelector) (*types.PaginationResponse, error) {
	podChannelList := channels.GetPodListChannel(K8.K8, namespace, metaV1.ListOptions{}, 1)
	metas, err := ChannelToMeta(*podChannelList, selector)
	if err != nil {
		return nil, err
	}
	resp := &types.PaginationResponse{
		Items:  metas,
		Count:  len(metas),
		Total:  selector.TotalItemCount,
		Offset: selector.Offset,
	}

	return resp, nil
}

func ChannelToMeta(podChannelList channels.PodListChannel, selector *types.DataSelector) ([]PodMeta, error) {
	pods := <-podChannelList.List
	err := <-podChannelList.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	podComps := ToComparable(pods)
	selector.Execute(podComps)
	pods = FromComparable(selector.Items)

	metas := []PodMeta{}
	for _, pod := range pods.Items {
		metas = append(metas, BuildPodMeta(&pod))
	}
	return metas, nil
}

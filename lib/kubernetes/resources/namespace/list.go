package namespace

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func List(K8 *kubernetes.K8Client, selector *types.DataSelector) (*types.PaginationResponse, error) {
	nsListChannel := channels.GetNamespaceListChannel(K8.K8, metaV1.ListOptions{}, 1)

	namespaces := <-nsListChannel.List
	err := <-nsListChannel.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	comps := toComparable(namespaces)
	selector.Execute(comps)
	namespaces = fromComparable(selector.Items)

	metas := []NamespaceMeta{}
	for _, pod := range namespaces.Items {
		metas = append(metas, *BuildNamespaceMeta(&pod))
	}

	resp := &types.PaginationResponse{
		Items:  metas,
		Count:  len(metas),
		Total:  selector.TotalItemCount,
		Offset: selector.Offset,
	}

	return resp, nil
}

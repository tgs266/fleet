package deployment

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func ListMetas(K8 *kubernetes.K8Client, namespace string, selector *types.DataSelector) (*types.PaginationResponse, error) {
	deploymentChannel := channels.GetDeploymentListChannel(K8.K8, namespace, metaV1.ListOptions{}, 1)

	metas, err := ProcessDeploymentListChannel(deploymentChannel, selector)
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	resp := &types.PaginationResponse{
		Items:  metas,
		Count:  len(metas),
		Total:  selector.TotalItemCount,
		Offset: selector.Offset,
	}

	return resp, nil
}

func ProcessDeploymentListChannel(dc *channels.DeploymentListChannel, selector *types.DataSelector) ([]DeploymentMeta, error) {

	deps := <-dc.List
	err := <-dc.Error

	depComps := ToComparable(deps)
	selector.Execute(depComps)
	deps = FromComparable(selector.Items)
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	metas := []DeploymentMeta{}
	for _, dep := range deps.Items {
		metas = append(metas, BuildDeploymentMeta(&dep))
	}

	return metas, nil

}

package fleet

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
)

type FleetColor string

const (
	RED    FleetColor = "#E76A6E"
	YELLOW            = "#FBD065"
	GREEN             = "#32A467"
)

type FleetColorRGB []int

var (
	RED_RGB    FleetColorRGB = []int{231, 106, 110}
	YELLOW_RGB               = []int{251, 208, 101}
	GREEN_RGB                = []int{50, 164, 103}
)

type FleetDimName string

const (
	DeploymentDimName FleetDimName = "deployment"
	PodDimName                     = "pod"
	ContainerDimName               = "container"
)

type FleetDim struct {
	DimName FleetDimName
}

var mapNameToDim = map[FleetDimName]FleetDim{
	DeploymentDimName: {DeploymentDimName},
	PodDimName:        {PodDimName},
}

type FleetRequestDimension struct {
	Dimension FleetDimName `json:"dimension"`
	Filters   []string     `json:"filters"`
	SortBy    []string     `json:"sortBy"`
}

func (frd *FleetRequestDimension) BuildDataSelector() *types.DataSelector {
	dr := &types.DataRequest{
		FilterBy: frd.Filters,
		SortBy:   frd.SortBy,
	}
	return dr.BuildDataSelector()
}

type FleetRequest struct {
	Dimensions []FleetRequestDimension `json:"dimensions"`
}

type FleetStatus struct {
	Value  string        `json:"value"`
	Reason string        `json:"reason"`
	Color  FleetColorRGB `json:"color"`
}

type FleetObjectMeta struct {
	UID       string            `json:"uid"`
	Name      string            `json:"name"`
	Namespace string            `json:"namespace"`
	Details   map[string]string `json:"details"`
}

type FleetObject struct {
	Mode      string                 `json:"mode"`
	Dimension FleetDimName           `json:"dimension"`
	Children  map[string]FleetObject `json:"children"`
	Status    FleetStatus            `json:"status"`
	Meta      FleetObjectMeta        `json:"meta"`
	channel   *FleetChannel
}

func Extract(arr []*FleetObject) ([]*FleetObject, error) {
	for _, o := range arr {
		channel := o.channel
		if err := channel.GetError(); err != nil {
			return nil, err
		}
		o.Children = channel.Get()
	}
	return arr, nil
}

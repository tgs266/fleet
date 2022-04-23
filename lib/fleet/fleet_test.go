package fleet

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
)

func TestBuildFleet(t *testing.T) {
	client := kubernetes.GetTestClient()
	req := &FleetRequest{
		Dimensions: []FleetRequestDimension{
			{
				Dimension: DeploymentDimName,
			},
			{
				Dimension: PodDimName,
			},
		},
	}
	fleet, err := BuildFleet(client, req)
	assert.Nil(t, err)
	assert.Len(t, fleet, 1)
}

func TestBuildFleet2(t *testing.T) {
	client := kubernetes.GetTestClient()
	req := &FleetRequest{
		Dimensions: []FleetRequestDimension{
			{
				Dimension: PodDimName,
			},
			{
				Dimension: ContainerDimName,
			},
		},
	}
	fleet, err := BuildFleet(client, req)
	assert.Nil(t, err)
	assert.Len(t, fleet, 3)
}

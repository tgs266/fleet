package fleet

import (
	"fmt"
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

func TestBuildFleet3(t *testing.T) {
	client := kubernetes.GetTestClient()
	req := &FleetRequest{
		Dimensions: []FleetRequestDimension{
			{
				Dimension: DeploymentDimName,
			},
			{
				Dimension: ContainerDimName,
			},
		},
	}
	fleet, err := BuildFleet(client, req)
	assert.Nil(t, err)
	assert.Len(t, fleet, 1)
}

func TestCleanFleet(t *testing.T) {
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
	last, err := BuildFleet(client, req)
	assert.Nil(t, err)
	fleet, err := BuildFleet(client, req)
	assert.Nil(t, err)
	lastTitles := ExtractIdentifiers(last)

	cleaned := CleanFleet(lastTitles, last, fleet)
	assert.Len(t, cleaned[0].Children, 0)
}

func TestCleanFleet2(t *testing.T) {
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
	last, err := BuildFleet(client, req)
	assert.Nil(t, err)
	fleet, err := BuildFleet(client, req)
	assert.Nil(t, err)
	lastTitles := ExtractIdentifiers(last)

	delete(fleet[0].Children, "asdf-1-asdf")
	fmt.Println(fleet[0].Children)

	cleaned := CleanFleet(lastTitles, last, fleet)
	assert.Len(t, cleaned[0].Children, 1)
}

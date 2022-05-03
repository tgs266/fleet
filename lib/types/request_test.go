package types

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBuildDataRequest(t *testing.T) {
	offset := 3
	pageSize := 10
	sortBy := "namespace,a|name,d|created_at"
	filterBy := "created_at,GT,15|created_at,LTE,35"

	dr := buildDataRequest(offset, pageSize, sortBy, filterBy)
	assert.Equal(t, offset, dr.Offset)
	assert.Equal(t, pageSize, dr.PageSize)
}

func TestBuildDataSelector(t *testing.T) {
	offset := 3
	pageSize := 10
	sortBy := "namespace,a|name,d|created_at"
	filterBy := "created_at,15,gt|created_at,35,lte"

	dr := buildDataRequest(offset, pageSize, sortBy, filterBy)
	ds := dr.BuildDataSelector()
	ds.AddIgnoreSystemNamespace()
	assert.Equal(t, offset, ds.Offset)
	assert.Equal(t, pageSize, ds.PageSize)
}

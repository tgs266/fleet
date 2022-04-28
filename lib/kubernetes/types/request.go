package types

import (
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/errors"
)

type Property string

const (
	NameProperty      = "name"
	CreatedAtProperty = "created_at"
	NamespaceProperty = "namespace"
	StatusProperty    = "status"
	LastSeenProperty  = "lastSeen"
)

var AllProperties = map[Property]string{
	NameProperty:      "string",
	CreatedAtProperty: "number",
	NamespaceProperty: "string",
	StatusProperty:    "string",
	LastSeenProperty:  "number",
}

func getProperty(value string) Property {
	if value == NameProperty || value == CreatedAtProperty || value == NamespaceProperty || value == StatusProperty {
		return Property(value)
	}
	panic("invalid sort property")
}

type DataRequest struct {
	Offset   int      `json:"offset"`
	PageSize int      `json:"pageSize"`
	SortBy   []string `json:"sortBy"`
	FilterBy []string `json:"filterBy"`
}

func BuildDataRequest(c *fiber.Ctx) *DataRequest {
	offset, _ := strconv.Atoi(c.Query("offset", "0"))
	pageSize, _ := strconv.Atoi(c.Query("pageSize", "-1"))
	sortBy := c.Query("sortBy", "")
	filterBy := c.Query("filterBy", "")
	return buildDataRequest(offset, pageSize, sortBy, filterBy)
}

func buildDataRequest(offset, pageSize int, sortBy, filterBy string) *DataRequest {
	splitSortBy := strings.Split(sortBy, "|")
	if sortBy == "" {
		splitSortBy = []string{}
	}
	splitFilterBy := strings.Split(filterBy, "|")
	if filterBy == "" {
		splitFilterBy = []string{}
	}
	return &DataRequest{
		Offset:   offset,
		PageSize: pageSize,
		SortBy:   splitSortBy,
		FilterBy: splitFilterBy,
	}
}

func buildFilters(dr *DataRequest) []Filter {
	if len(dr.FilterBy) == 0 {
		return EmptyFilters
	}
	filters := []Filter{}
	for i, f := range dr.FilterBy {
		splitFilter := strings.Split(f, ",")
		if len(splitFilter) != 3 {
			panic(errors.NewBadFilterError(i, f))
		}

		filters = append(filters, Filter{
			Property: getProperty(splitFilter[0]),
			By:       getComparable(splitFilter[1]),
			Operator: getOperator(splitFilter[2]),
		})
	}
	return filters
}

func (dr *DataRequest) BuildDataSelector() *DataSelector {
	sortBys := []SortBy{}
	for _, s := range dr.SortBy {
		split := strings.Split(s, ",")
		if len(split) == 1 || split[1] != "a" {
			sortBys = append(sortBys, SortBy{
				Property: getProperty(split[0]),
			})
		} else {
			sortBys = append(sortBys, SortBy{
				Ascending: true,
				Property:  getProperty(split[0]),
			})
		}
	}
	return &DataSelector{
		Offset:   dr.Offset,
		PageSize: dr.PageSize,
		SortBy:   sortBys,
		Filters:  buildFilters(dr),
	}
}

// wont add if a filter already exists on system namespace
// disable for now
func (ds *DataSelector) AddIgnoreSystemNamespace() *DataSelector {
	// for _, f := range ds.Filters {
	// 	if f.Property == NamespaceProperty && f.By == ComparableString("kube-system") {
	// 		return ds
	// 	}
	// }
	// ds.Filters = append(ds.Filters, SystemNamespaceFilter)
	return ds
}

package types

import (
	"sort"
)

type DataSelector struct {
	PageSize int
	Offset   int

	TotalItemCount int

	SortBy        []SortBy
	Filters       Filters
	PausedFilters Filters

	Items []ComparableType
}

func (ds *DataSelector) AddFilter(f Filter) *DataSelector {
	ds.Filters = append(ds.Filters, f)
	return ds
}

func (ds *DataSelector) Len() int {
	return len(ds.Items)
}

func (ds *DataSelector) Swap(i, j int) {
	ds.Items[i], ds.Items[j] = ds.Items[j], ds.Items[i]
}

func (ds *DataSelector) Less(i, j int) bool {
	for _, sortBy := range ds.SortBy {
		a := ds.Items[i].Get(sortBy.Property)
		b := ds.Items[j].Get(sortBy.Property)
		// ignore sort completely if property name not found
		if a == nil || b == nil {
			break
		}
		cmp := a.Compare(b)
		if cmp == 0 { // values are the same. Just continue to next sortBy
			continue
		} else { // values different
			return (cmp == 1 && sortBy.Ascending) || (cmp == -1 && !sortBy.Ascending)
		}
	}
	return false
}

func (ds *DataSelector) Sort() *DataSelector {
	sort.Sort(ds)
	return ds
}

func (ds *DataSelector) filter() *DataSelector {
	ds.Items = ds.Filters.Execute(ds.Items)
	return ds
}

func (ds *DataSelector) setTotalItemCountFromInternal() *DataSelector {
	ds.TotalItemCount = len(ds.Items)
	return ds
}

func (ds *DataSelector) PauseFilters(filters Filters) *DataSelector {
	pausedFilters := Filters{}
	keepFilters := Filters{}
	for _, passedFilter := range filters {
		for _, filter := range ds.Filters {
			if passedFilter == filter {
				pausedFilters = append(pausedFilters, filter)
			} else {
				keepFilters = append(keepFilters, filter)
			}
		}
	}
	ds.Filters = keepFilters
	ds.PausedFilters = pausedFilters
	return ds
}

func (ds *DataSelector) ResumeFilters() *DataSelector {
	ds.Filters = append(ds.Filters, ds.PausedFilters...)
	ds.PausedFilters = Filters{}
	return ds
}

func (ds *DataSelector) Execute(items []ComparableType) *DataSelector {
	ds.Items = items
	ds.filter().setTotalItemCountFromInternal().Sort()
	if ds.Offset >= 0 {
		if ds.Len() > ds.PageSize {
			if ds.PageSize > 0 {
				max := ds.Offset + ds.PageSize
				if max >= len(ds.Items) {
					max = len(ds.Items)
				}
				ds.Items = ds.Items[ds.Offset:max]
			} else {
				ds.Items = ds.Items[ds.Offset:]
			}
		}
	}
	return ds
}

package helm

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"helm.sh/helm/v3/pkg/release"
)

type chartComparable struct {
	chart *Chart
}

type releaseComparable struct {
	release *release.Release
}

func (comp chartComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.chart.Name)
	case types.RepoProperty:
		return types.ComparableString(comp.chart.Repo)
	}
	return types.ComparableString("")
}

func (comp releaseComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.release.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.release.Namespace)
	case types.ChartNameProperty:
		return types.ComparableString(comp.release.Chart.Metadata.Name)
	}
	return types.ComparableString("")
}

func ToChartComparable(items []*Chart) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, i := range items {
		comps = append(comps, chartComparable{chart: i})
	}
	return comps
}

func FromChartComparable(items []types.ComparableType) []*Chart {
	list := []*Chart{}
	for _, item := range items {
		list = append(list, item.(chartComparable).chart)
	}
	return list
}

func ToReleaseComparable(items []*release.Release) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, i := range items {
		comps = append(comps, releaseComparable{release: i})
	}
	return comps
}

func FromReleaseComparable(items []types.ComparableType) []*release.Release {
	list := []*release.Release{}
	for _, item := range items {
		list = append(list, item.(releaseComparable).release)
	}
	return list
}

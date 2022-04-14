package event

import (
	"github.com/tgs266/fleet/lib/kubernetes/types"
	v1 "k8s.io/api/core/v1"
)

type eventComparable struct {
	event v1.Event
}

func (comp eventComparable) Get(field types.Property) types.Comparable {
	switch field {
	case types.NameProperty:
		return types.ComparableString(comp.event.Name)
	case types.NamespaceProperty:
		return types.ComparableString(comp.event.Namespace)
	case types.CreatedAtProperty:
		return types.ComparableInt64(comp.event.CreationTimestamp.Time.UnixMilli())
	case types.LastSeenProperty:
		return types.ComparableInt64(comp.event.LastTimestamp.Time.UnixMilli())
	}
	return types.ComparableString("")
}

func ToComparable(events *v1.EventList) []types.ComparableType {
	comps := []types.ComparableType{}
	for _, event := range events.Items {
		comps = append(comps, eventComparable{event: event})
	}
	return comps
}

func FromComparable(events []types.ComparableType) *v1.EventList {
	list := []v1.Event{}
	for _, event := range events {
		list = append(list, event.(eventComparable).event)
	}
	return &v1.EventList{
		Items: list,
	}
}

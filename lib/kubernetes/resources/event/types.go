package event

import (
	v1 "k8s.io/api/core/v1"
)

type Event struct {
	UID             string `json:"uid"`
	Name            string `json:"name"`
	Messasge        string `json:"message"`
	SourceComponent string `json:"sourceComponent"`
	SourceHost      string `json:"sourceHost"`
	Type            string `json:"type"`
	Reason          string `json:"reason"`
	FirstSeen       int64  `json:"firstSeen"`
	LastSeen        int64  `json:"lastSeen"`
	Count           int    `json:"count"`
}

func BuildEvent(event v1.Event) Event {
	// event.Object.
	return Event{
		UID:             string(event.UID),
		Name:            event.Name,
		Type:            event.Type,
		Messasge:        event.Message,
		Reason:          event.Reason,
		SourceComponent: event.Source.Component,
		SourceHost:      event.Source.Host,
		FirstSeen:       event.FirstTimestamp.Time.UnixMilli(),
		LastSeen:        event.LastTimestamp.Time.UnixMilli(),
		Count:           int(event.Count),
	}
}

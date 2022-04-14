package endpoint

import (
	v1 "k8s.io/api/core/v1"
)

type Endpoint struct {
	Host     string            `json:"host"`
	Ports    []v1.EndpointPort `json:"ports"`
	Ready    bool              `json:"ready"`
	NodeName *string           `json:"nodeName"`
}

func BuildEndpoints(endpoints []v1.Endpoints) []*Endpoint {
	ends := []*Endpoint{}

	for _, endpoint := range endpoints {
		for _, subSets := range endpoint.Subsets {
			for _, address := range subSets.Addresses {
				ends = append(ends, BuildEndpoint(address, subSets.Ports, true))
			}
			for _, notReadyAddress := range subSets.NotReadyAddresses {
				ends = append(ends, BuildEndpoint(notReadyAddress, subSets.Ports, false))
			}
		}
	}
	return ends
}

func BuildEndpoint(address v1.EndpointAddress, ports []v1.EndpointPort, ready bool) *Endpoint {
	return &Endpoint{
		Host:     address.IP,
		Ports:    ports,
		Ready:    ready,
		NodeName: address.NodeName,
	}

}

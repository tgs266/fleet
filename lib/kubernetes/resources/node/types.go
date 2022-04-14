package node

import (
	"github.com/tgs266/fleet/lib/kubernetes/common"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	v1 "k8s.io/api/core/v1"
)

// need pods to calc this
type NodeResources struct {
	MemoryCapacity int64 `json:"memoryCapacity"`
	CPUCapacity    int64 `json:"cpuCapacity"`
	PodCapacity    int64 `json:"podCapacity"`

	AllocatedPods int `json:"allocatedPods"`

	MemoryRequests         int     `json:"memoryRequests"`
	CPURequests            int     `json:"cpuRequests"`
	MemoryRequestsFraction float64 `json:"memoryRequestsFraction"`
	CPURequestsFraction    float64 `json:"cpuRequestsFraction"`

	MemoryLimit         int     `json:"memoryLimit"`
	CPULimit            int     `json:"cpuLimit"`
	MemoryLimitFraction float64 `json:"memoryLimitFraction"`
	CPULimitFraction    float64 `json:"cpuLimitFraction"`

	AllocatedPodFraction float64 `json:"allocatedPodFraction"`
}

type AccumulatedPodResources struct {
	MemoryLimit int64
	CPULimit    int64

	MemoryRequests int64
	CPURequests    int64
}

type NodeMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	CreatedAt   int               `json:"createdAt"`
	Resources   NodeResources     `json:"nodeResources"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
}

type Node struct {
	NodeMeta  `json:",inline"`
	PodCIDR   string            `json:"podCIDR"`
	NodeInfo  v1.NodeSystemInfo `json:"nodeInfo"`
	Addresses []v1.NodeAddress  `json:"addresses"`

	Pods types.PaginationResponse `json:"pods"`
}

func getPodResourceRequestsAndLimits(pod *v1.Pod) AccumulatedPodResources {
	var podMemoryRequests int64 = 0
	var podMemoryLimit int64 = 0
	var podCPURequests int64 = 0
	var podCPULimit int64 = 0

	for _, c := range pod.Spec.Containers {
		podMemoryLimit += c.Resources.Limits.Memory().Value()
		podMemoryRequests += c.Resources.Requests.Memory().Value()

		podCPULimit += c.Resources.Limits.Cpu().MilliValue()
		podCPURequests += c.Resources.Requests.Cpu().MilliValue()
	}

	for _, c := range pod.Spec.InitContainers {
		if c.Resources.Limits.Memory().Value() < podMemoryLimit {
			podMemoryLimit = c.Resources.Limits.Memory().Value()
		}
		if c.Resources.Requests.Memory().Value() < podMemoryRequests {
			podMemoryRequests = c.Resources.Requests.Memory().Value()
		}

		if c.Resources.Limits.Cpu().MilliValue() < podCPULimit {
			podCPULimit = c.Resources.Limits.Cpu().MilliValue()
		}
		if c.Resources.Requests.Cpu().MilliValue() < podCPURequests {
			podCPURequests = c.Resources.Requests.Cpu().MilliValue()
		}
	}

	if pod.Spec.Overhead != nil {
		podMemoryRequests += pod.Spec.Overhead.Memory().Value()
		podCPURequests += pod.Spec.Overhead.Cpu().Value()
	}

	return AccumulatedPodResources{
		MemoryLimit:    podMemoryLimit,
		MemoryRequests: podMemoryRequests,
		CPULimit:       podCPULimit,
		CPURequests:    podCPURequests,
	}
}

func getNodeResources(node *v1.Node, pods *v1.PodList) NodeResources {

	totalPodResources := &AccumulatedPodResources{
		MemoryLimit:    0,
		MemoryRequests: 0,
		CPULimit:       0,
		CPURequests:    0,
	}

	if pods != nil {
		for _, pod := range pods.Items {
			resources := getPodResourceRequestsAndLimits(&pod)
			totalPodResources.CPULimit += resources.CPULimit
			totalPodResources.CPURequests += resources.CPURequests
			totalPodResources.MemoryLimit += resources.MemoryLimit
			totalPodResources.MemoryRequests += resources.MemoryRequests
		}
	}

	cpuCapacity := node.Status.Allocatable.Cpu().MilliValue()
	memoryCapacity := node.Status.Allocatable.Memory().Value()

	resources := NodeResources{
		MemoryCapacity: memoryCapacity,
		CPUCapacity:    cpuCapacity,
		PodCapacity:    node.Status.Allocatable.Pods().Value(),

		MemoryRequests:         int(totalPodResources.MemoryRequests),
		CPURequests:            int(totalPodResources.CPURequests),
		MemoryRequestsFraction: float64(totalPodResources.MemoryRequests) / float64(memoryCapacity),
		CPURequestsFraction:    float64(totalPodResources.CPURequests) / float64(cpuCapacity),

		MemoryLimit:         int(totalPodResources.MemoryLimit),
		CPULimit:            int(totalPodResources.CPULimit),
		MemoryLimitFraction: float64(totalPodResources.MemoryLimit) / float64(memoryCapacity),
		CPULimitFraction:    float64(totalPodResources.CPULimit) / float64(cpuCapacity),

		AllocatedPods:        len(pods.Items),
		AllocatedPodFraction: float64(len(pods.Items)) / float64(node.Status.Allocatable.Pods().Value()),
	}
	return resources
}

func BuildNodeMeta(node *v1.Node, pods *v1.PodList) *NodeMeta {
	return &NodeMeta{
		UID:         string(node.UID),
		Name:        node.Name,
		CreatedAt:   int(node.CreationTimestamp.UnixMilli()),
		Resources:   getNodeResources(node, pods),
		Labels:      node.Labels,
		Annotations: common.CleanAnnotations(node.Annotations),
	}
}

func BuildNode(node *v1.Node, pods *v1.PodList, queriedPods *v1.PodList, podDataSelect *types.DataSelector) *Node {

	podMetas := []pod.PodMeta{}

	if pods != nil {
		for _, p := range queriedPods.Items {
			podMetas = append(podMetas, pod.BuildPodMeta(&p))
		}
	}

	podList := types.PaginationResponse{
		Items:  podMetas,
		Total:  podDataSelect.TotalItemCount,
		Count:  len(podMetas),
		Offset: podDataSelect.Offset,
	}

	return &Node{
		NodeMeta:  *BuildNodeMeta(node, pods),
		PodCIDR:   node.Spec.PodCIDR,
		Addresses: node.Status.Addresses,
		NodeInfo:  node.Status.NodeInfo,

		Pods: podList,
	}
}

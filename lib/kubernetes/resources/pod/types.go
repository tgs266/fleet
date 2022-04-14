package pod

import (
	"fmt"

	"github.com/tgs266/fleet/lib/kubernetes/common"
	"github.com/tgs266/fleet/lib/kubernetes/resources/condition"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	v1 "k8s.io/api/core/v1"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

type PodStatus struct {
	GenericStatus string `json:"genericStatus"`
	Reason        string `json:"reason"`
}

type PodResources struct {
	CPURequests    int64 `json:"cpuRequests"`
	MemoryRequests int64 `json:"memoryRequests"`

	CPULimit    int64 `json:"cpuLimit"`
	MemoryLimit int64 `json:"memoryLimit"`

	MemoryUsage                 int64   `json:"memoryUsage"`
	MemoryUsageRequestsFraction float64 `json:"memoryUsageRequestsFraction"`
	MemoryUsageLimitFraction    float64 `json:"memoryUsageLimitFraction"`

	CPUUsage                 int64   `json:"cpuUsage"`
	CPUUsageRequestsFraction float64 `json:"cpuUsageRequestsFraction"`
	CPUUsageLimitFraction    float64 `json:"cpuUsageLimitFraction"`
}

type PodMeta struct {
	UID         string            `json:"uid"`
	Name        string            `json:"name"`
	Namespace   string            `json:"namespace"`
	CreatedAt   uint              `json:"createdAt"`
	Status      PodStatus         `json:"status"`
	Restarts    int32             `json:"restarts"`
	NodeName    string            `json:"nodeName"`
	Labels      map[string]string `json:"labels"`
	Annotations map[string]string `json:"annotations"`
}

type Pod struct {
	PodMeta    `json:",inline"`
	IP         string                `json:"ip"`
	Containers []container.Container `json:"containers"`
	Resources  *PodResources         `json:"resources"`
	Conditions []condition.Condition `json:"conditions"`
}

func getPodResources(pod *v1.Pod, podMets *v1beta1.PodMetrics) *PodResources {

	resources := &PodResources{
		MemoryLimit:    0,
		MemoryRequests: 0,

		CPULimit:    0,
		CPURequests: 0,

		CPUUsage:                 -1.0,
		CPUUsageRequestsFraction: -1.0,
		CPUUsageLimitFraction:    -1.0,

		MemoryUsage:                 -1.0,
		MemoryUsageRequestsFraction: -1.0,
		MemoryUsageLimitFraction:    -1.0,
	}

	for _, c := range pod.Spec.Containers {

		resources.MemoryLimit += c.Resources.Limits.Memory().Value()
		resources.MemoryRequests += c.Resources.Requests.Memory().Value()

		resources.CPULimit += c.Resources.Limits.Cpu().MilliValue()
		resources.CPURequests += c.Resources.Requests.Cpu().MilliValue()
	}

	for _, c := range pod.Spec.InitContainers {
		if c.Resources.Limits.Memory().Value() < resources.MemoryLimit {
			resources.MemoryLimit = c.Resources.Limits.Memory().Value()
		}
		if c.Resources.Requests.Memory().Value() < resources.MemoryRequests {
			resources.MemoryRequests = c.Resources.Requests.Memory().Value()
		}

		if c.Resources.Limits.Cpu().MilliValue() < resources.CPULimit {
			resources.CPULimit = c.Resources.Limits.Cpu().MilliValue()
		}
		if c.Resources.Requests.Cpu().MilliValue() < resources.CPURequests {
			resources.CPURequests = c.Resources.Requests.Cpu().MilliValue()
		}
	}

	if pod.Spec.Overhead != nil {
		resources.MemoryRequests += pod.Spec.Overhead.Memory().Value()
		resources.CPURequests += pod.Spec.Overhead.Cpu().Value()
	}

	if podMets != nil {
		for _, m := range podMets.Containers {
			resources.MemoryUsage += m.Usage.Memory().Value()
			resources.CPUUsage += m.Usage.Cpu().MilliValue()
		}

		if resources.CPULimit != 0 {
			resources.CPUUsageLimitFraction = float64(resources.CPUUsage) / float64(resources.CPULimit)
		}
		if resources.CPURequests != 0 {
			resources.CPUUsageRequestsFraction = float64(resources.CPUUsage) / float64(resources.CPURequests)
		}

		if resources.MemoryLimit != 0 {
			resources.MemoryUsageLimitFraction = float64(resources.MemoryUsage) / float64(resources.MemoryLimit)
		}
		if resources.MemoryRequests != 0 {
			resources.MemoryUsageRequestsFraction = float64(resources.MemoryUsage) / float64(resources.MemoryRequests)
		}

	}

	return resources
}

func getRestartCount(pod *v1.Pod) int32 {
	var restartCount int32 = 0
	for _, status := range pod.Status.ContainerStatuses {
		restartCount += status.RestartCount
	}
	return restartCount
}

// shoutout to kubernetes authors for the following code
// adapted from https://github.com/kubernetes/kubernetes/blob/master/pkg/printers/internalversion/printers.go#L734
func hasPodReadyCondition(conditions []v1.PodCondition) bool {
	for _, condition := range conditions {
		if condition.Type == v1.PodReady && condition.Status == v1.ConditionTrue {
			return true
		}
	}
	return false
}

func GetPodStatus(pod *v1.Pod) PodStatus {
	readyContainers := 0

	reason := string(pod.Status.Phase)
	genericStatus := ""
	if pod.Status.Reason != "" {
		reason = pod.Status.Reason
		genericStatus = "Pending"
	}

	initializing := false
	for i := range pod.Status.InitContainerStatuses {
		container := pod.Status.InitContainerStatuses[i]
		switch {
		case container.State.Terminated != nil && container.State.Terminated.ExitCode == 0:
			continue
		case container.State.Terminated != nil:
			genericStatus = "Terminated"
			// initialization is failed
			if len(container.State.Terminated.Reason) == 0 {
				if container.State.Terminated.Signal != 0 {
					reason = fmt.Sprintf("Init:Signal:%d", container.State.Terminated.Signal)
				} else {
					reason = fmt.Sprintf("Init:ExitCode:%d", container.State.Terminated.ExitCode)
				}
			} else {
				reason = "Init:" + container.State.Terminated.Reason
			}
			initializing = true
		case container.State.Waiting != nil && len(container.State.Waiting.Reason) > 0 && container.State.Waiting.Reason != "PodInitializing":
			genericStatus = "Pending"
			reason = "Init:" + container.State.Waiting.Reason
			initializing = true
		default:
			genericStatus = "Pending"
			reason = fmt.Sprintf("Init:%d/%d", i, len(pod.Spec.InitContainers))
			initializing = true
		}
		break
	}
	if !initializing {
		hasRunning := false
		for i := len(pod.Status.ContainerStatuses) - 1; i >= 0; i-- {
			container := pod.Status.ContainerStatuses[i]

			if container.State.Waiting != nil && container.State.Waiting.Reason != "" {
				genericStatus = "Pending"
				reason = container.State.Waiting.Reason
			} else if container.State.Terminated != nil && container.State.Terminated.Reason != "" {
				genericStatus = "Terminated"
				reason = container.State.Terminated.Reason
			} else if container.State.Terminated != nil && container.State.Terminated.Reason == "" {
				genericStatus = "Terminated"
				if container.State.Terminated.Signal != 0 {
					reason = fmt.Sprintf("Signal:%d", container.State.Terminated.Signal)
				} else {
					reason = fmt.Sprintf("ExitCode:%d", container.State.Terminated.ExitCode)
				}
			} else if container.Ready && container.State.Running != nil {
				genericStatus = "Running"
				hasRunning = true
				readyContainers++
			}
		}

		// change pod status back to "Running" if there is at least one container still reporting as "Running" status
		if reason == "Completed" && hasRunning {
			if hasPodReadyCondition(pod.Status.Conditions) {
				genericStatus = "Running"
				reason = "Running"
			} else {
				genericStatus = "Running"
				reason = "NotReady"
			}
		}
	}

	if pod.DeletionTimestamp != nil && pod.Status.Reason == "NodeLost" {
		genericStatus = "Unknown"
		reason = "Unknown"
	} else if pod.DeletionTimestamp != nil {
		genericStatus = "Waiting"
		reason = "Terminating"
	}
	return PodStatus{
		GenericStatus: genericStatus,
		Reason:        reason,
	}
}

func BuildPodMeta(pod *v1.Pod) PodMeta {
	return PodMeta{
		UID:         string(pod.UID),
		Name:        pod.Name,
		Namespace:   pod.Namespace,
		CreatedAt:   uint(pod.CreationTimestamp.UnixMilli()),
		Status:      GetPodStatus(pod),
		Restarts:    getRestartCount(pod),
		Annotations: common.CleanAnnotations(pod.GetAnnotations()),
		Labels:      pod.Labels,
		NodeName:    pod.Spec.NodeName,
	}
}

func BuildPod(pod *v1.Pod, podMets *v1beta1.PodMetrics) *Pod {
	containers := []container.Container{}
	for c := range pod.Spec.Containers {
		cont := pod.Spec.Containers[c]
		var state v1.ContainerState
		if len(pod.Spec.Containers) == len(pod.Status.ContainerStatuses) {
			state = pod.Status.ContainerStatuses[c].State
		}

		if podMets != nil && len(podMets.Containers) == len(pod.Spec.Containers) {
			met := podMets.Containers[c]
			containers = append(containers, *container.BuildContainer(cont, &met, state))
		} else {
			containers = append(containers, *container.BuildContainer(cont, nil, state))
		}

	}

	conds := []condition.Condition{}
	for _, c := range pod.Status.Conditions {
		conds = append(conds, condition.BuildFromPodCondition(c))
	}

	return &Pod{
		PodMeta:    BuildPodMeta(pod),
		Resources:  getPodResources(pod, podMets),
		IP:         pod.Status.PodIP,
		Containers: containers,
		Conditions: conds,
	}
}

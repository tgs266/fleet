package container

import (
	"strings"

	"github.com/tgs266/fleet/lib/kubernetes/resources/image"

	v1 "k8s.io/api/core/v1"
	"k8s.io/metrics/pkg/apis/metrics/v1beta1"
)

type Port struct {
	ContainerPort int    `json:"containerPort"`
	HostPort      int    `json:"hostPort"`
	HostIP        string `json:"hostIp"`
	Protocol      string `json:"protocol"`
}

type Env struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

type ContainerSpec struct {
	Name            string      `json:"name"`
	Image           image.Image `json:"image"`
	Ports           []*Port     `json:"ports,omitempty"`
	EnvVars         []*Env      `json:"envVars,omitempty"`
	ImagePullPolicy string      `json:"imagePullPolicy"`

	CPURequests int64 `json:"cpuRequests"`
	MemRequests int64 `json:"memRequests"`
	CPULimit    int64 `json:"cpuLimit"`
	MemLimit    int64 `json:"memLimit"`
}

type Container struct {
	Name            string      `json:"name"`
	Image           image.Image `json:"image"`
	State           string      `json:"state"`
	Ports           []*Port     `json:"ports,omitempty"`
	EnvVars         []*Env      `json:"envVars,omitempty"`
	ImagePullPolicy string      `json:"imagePullPolicy"`

	CPURequests int64 `json:"cpuRequests"`
	MemRequests int64 `json:"memRequests"`
	CPULimit    int64 `json:"cpuLimit"`
	MemLimit    int64 `json:"memLimit"`
	CPUUsage    int64 `json:"cpuUsage,omitempty"`
	MemUsage    int64 `json:"memUsage,omitempty"`
}

func GetStatus(containerState v1.ContainerState) string {
	if containerState.Terminated != nil {
		return "Terminated"
	} else if containerState.Waiting != nil {
		return "Waiting"
	} else if containerState.Running != nil {
		return "Running"
	} else {
		return "Unknown"
	}
}

// https://kubernetes.io/docs/concepts/containers/images/#imagepullpolicy-defaulting
func GetPullPolicy(c v1.Container) string {
	policy := string(c.ImagePullPolicy)
	if policy == "" {
		image := strings.Split(c.Image, ":")
		if len(image) == 1 {
			return "Always"
		} else {
			if image[1] == "latest" {
				return "Always"
			} else {
				return "IfNotPresent"
			}
		}
	}
	return policy
}

func BuildPortArray(c v1.Container) []*Port {
	ports := make([]*Port, 0)
	for _, p := range c.Ports {
		ports = append(ports, &Port{
			HostPort:      int(p.HostPort),
			HostIP:        p.HostIP,
			ContainerPort: int(p.ContainerPort),
			Protocol:      string(p.Protocol),
		})
	}
	return ports
}

func BuildEnvArray(c v1.Container) []*Env {
	envs := make([]*Env, 0)
	for _, e := range c.Env {
		envs = append(envs, &Env{
			Name:  e.Name,
			Value: e.Value,
		})
	}
	return envs
}

func BuildContainer(c v1.Container, met *v1beta1.ContainerMetrics, containerState v1.ContainerState) *Container {
	container := &Container{
		Name: c.Name,
		Image: image.Image{
			Name: strings.Split(c.Image, ":")[0],
			Tag:  strings.Split(c.Image, ":")[1],
		},
		ImagePullPolicy: GetPullPolicy(c),
		State:           GetStatus(containerState),

		Ports:   BuildPortArray(c),
		EnvVars: BuildEnvArray(c),

		CPURequests: c.Resources.Requests.Cpu().MilliValue(),
		MemRequests: c.Resources.Requests.Memory().Value(),
		CPULimit:    c.Resources.Limits.Cpu().MilliValue(),
		MemLimit:    c.Resources.Limits.Memory().Value(),
	}
	if met != nil {
		container.CPUUsage = met.Usage.Cpu().MilliValue()
		container.MemUsage = met.Usage.Memory().Value()
	}
	return container
}

func BuildContainerSpec(c v1.Container) ContainerSpec {
	return ContainerSpec{
		Name: c.Name,
		Image: image.Image{
			Name: strings.Split(c.Image, ":")[0],
			Tag:  strings.Split(c.Image, ":")[1],
		},
		ImagePullPolicy: GetPullPolicy(c),
		Ports:           BuildPortArray(c),
		EnvVars:         BuildEnvArray(c),
		CPURequests:     c.Resources.Requests.Cpu().MilliValue(),
		MemRequests:     c.Resources.Requests.Memory().Value(),
		CPULimit:        c.Resources.Limits.Cpu().MilliValue(),
		MemLimit:        c.Resources.Limits.Memory().Value(),
	}
}

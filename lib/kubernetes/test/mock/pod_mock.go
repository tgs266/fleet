package mock

import (
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type PodMock struct {
	Name           string
	Namespace      string
	AppLabel       string
	ContainerCount int
}

func MockContainers(count int) []corev1.Container {
	res := []corev1.Container{}
	for i := 0; i < count; i++ {
		res = append(res, corev1.Container{
			Name:            "asdf",
			Image:           "asdf:asdf",
			ImagePullPolicy: "pullPolicy",
			Ports:           []corev1.ContainerPort{},
			Env:             []corev1.EnvVar{},
			Resources: corev1.ResourceRequirements{
				Limits: corev1.ResourceList{
					corev1.ResourceCPU:    *resource.NewMilliQuantity(int64(10), resource.DecimalSI),
					corev1.ResourceMemory: *resource.NewQuantity(int64(10), resource.DecimalSI),
				},
				Requests: corev1.ResourceList{
					corev1.ResourceCPU:    *resource.NewMilliQuantity(int64(10), resource.DecimalSI),
					corev1.ResourceMemory: *resource.NewQuantity(int64(10), resource.DecimalSI),
				},
			},
		})
	}
	return res
}

func GeneratePod(podMock PodMock) *corev1.Pod {
	conts := MockContainers(podMock.ContainerCount)
	return &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      podMock.Name,
			Namespace: podMock.Namespace,
			Labels: map[string]string{
				"k8s-app": podMock.AppLabel,
			},
		},
		Status: corev1.PodStatus{
			ContainerStatuses: []corev1.ContainerStatus{
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Waiting: &corev1.ContainerStateWaiting{},
					},
				},
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Running: &corev1.ContainerStateRunning{},
					},
				},
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Terminated: &corev1.ContainerStateTerminated{},
					},
				},
			},
			InitContainerStatuses: []corev1.ContainerStatus{
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Waiting: &corev1.ContainerStateWaiting{},
					},
				},
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Running: &corev1.ContainerStateRunning{},
					},
				},
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Terminated: &corev1.ContainerStateTerminated{},
					},
				},
			},
		},
		Spec: corev1.PodSpec{
			Containers:     conts,
			InitContainers: conts,
		},
	}
}

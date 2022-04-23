package mock

import (
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/types"
)

type PodMock struct {
	UID            string
	Name           string
	Namespace      string
	NodeName       string
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
	return &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			UID:       types.UID(podMock.UID),
			Name:      podMock.Name,
			Namespace: podMock.Namespace,
			Labels: map[string]string{
				"k8s-app": podMock.AppLabel,
			},
		},
		Status: corev1.PodStatus{
			Phase: corev1.PodRunning,
			ContainerStatuses: []corev1.ContainerStatus{
				{
					Name: "asdf",
					State: corev1.ContainerState{
						Waiting: &corev1.ContainerStateWaiting{
							Reason: "Because",
						},
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
						Terminated: &corev1.ContainerStateTerminated{
							ExitCode: 12,
							Reason:   "Because",
						},
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
						Terminated: &corev1.ContainerStateTerminated{
							ExitCode: 12,
						},
					},
				},
			},
		},
		Spec: corev1.PodSpec{
			Containers:     MockContainers(3),
			InitContainers: MockContainers(3),
			NodeName:       podMock.NodeName,
		},
	}
}

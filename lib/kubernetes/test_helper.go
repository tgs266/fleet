package kubernetes

import (
	"github.com/tgs266/fleet/lib/kubernetes/test/mock"
	"github.com/tgs266/fleet/lib/shared"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func GetTestClient() *K8Client {

	pods := []runtime.Object{
		mock.GeneratePod(mock.PodMock{
			Name:      "asdf-1",
			Namespace: "ns",
			NodeName:  "node",
			AppLabel:  "asdf",
		}),
		mock.GeneratePod(mock.PodMock{
			Name:      "asdf-2",
			Namespace: "ns",
			NodeName:  "node",
			AppLabel:  "asdf",
		}),
		mock.GeneratePod(mock.PodMock{
			Name:      "asdf-3",
			Namespace: "ns",
			NodeName:  "node",
			AppLabel:  "asdf",
		}),
	}

	deployments := []runtime.Object{
		&appsv1.Deployment{
			ObjectMeta: metav1.ObjectMeta{
				Name:      "dep1",
				Namespace: "namespace1",
				Labels: map[string]string{
					"k8s-app": "asdf",
				},
			},
			Spec: appsv1.DeploymentSpec{
				Replicas: shared.Int32Ptr(3),
			},
		},
	}

	nodes := []runtime.Object{
		&corev1.Node{
			ObjectMeta: metav1.ObjectMeta{
				Name: "asdf",
			},
		},
	}

	client := fake.NewSimpleClientset(append(append(nodes, deployments...), pods...)...)
	return &K8Client{
		K8: client,
	}
}

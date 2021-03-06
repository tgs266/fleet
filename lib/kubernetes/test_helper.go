package kubernetes

import (
	"github.com/tgs266/fleet/lib/kubernetes/test/mock"
	"github.com/tgs266/fleet/lib/logging"
	"github.com/tgs266/fleet/lib/prometheus"
	"github.com/tgs266/fleet/lib/shared"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
	rest_fake "k8s.io/client-go/rest/fake"
)

func GetTestClient() *K8Client {

	logging.Init(logging.LVL_INFO)

	pods := []runtime.Object{
		mock.GeneratePod(mock.PodMock{
			UID:       "asdf-1",
			Name:      "asdf-1",
			Namespace: "ns",
			NodeName:  "node",
			AppLabel:  "asdf",
		}),
		mock.GeneratePod(mock.PodMock{
			UID:       "asdf-2",
			Name:      "asdf-2",
			Namespace: "ns",
			NodeName:  "node",
			AppLabel:  "asdf",
		}),
		mock.GeneratePod(mock.PodMock{
			UID:       "asdf-3",
			Name:      "asdf-3",
			Namespace: "ns",
			NodeName:  "node",
			AppLabel:  "asdf",
		}),
	}

	serviceAccounts := []runtime.Object{
		&corev1.ServiceAccount{
			ObjectMeta: metav1.ObjectMeta{
				Name:      "sa1",
				Namespace: "namespace1",
				Labels: map[string]string{
					"k8s-app": "asdf",
				},
			},
		},
		&corev1.ServiceAccount{
			ObjectMeta: metav1.ObjectMeta{
				Name:      "sa2",
				Namespace: "namespace1",
				Labels: map[string]string{
					"k8s-app": "asdf",
				},
			},
		},
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

	objs := []runtime.Object{}
	objs = append(objs, deployments...)
	objs = append(objs, pods...)
	objs = append(objs, nodes...)
	objs = append(objs, serviceAccounts...)

	client := fake.NewSimpleClientset(objs...)
	prom := prometheus.New(&rest_fake.RESTClient{})
	return &K8Client{
		K8:         client,
		Prometheus: prom,
	}
}

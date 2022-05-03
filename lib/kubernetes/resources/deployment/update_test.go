package deployment

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/container"
	"github.com/tgs266/fleet/lib/kubernetes/resources/image"
	"github.com/tgs266/fleet/lib/shared"
	"github.com/tgs266/fleet/lib/types"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestRestart(t *testing.T) {
	testCases := []struct {
		name            string
		deps            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		targetName      string
		expectedCount   int
	}{
		{
			name: "get",
			deps: []runtime.Object{
				&appsv1.Deployment{

					ObjectMeta: metav1.ObjectMeta{
						Name:      "dep1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"k8s-app": "asdf",
						},
					},
					Spec: appsv1.DeploymentSpec{
						Replicas: shared.Int32Ptr(1),
						Selector: &metav1.LabelSelector{
							MatchLabels: map[string]string{
								"k8s-app": "asdf",
							},
						},
					},
				},
			},
			targetNamespace: "namespace1",
			targetName:      "dep1",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.deps...)
			err := Restart(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			res, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			assert.Equal(t, test.targetName, res.Name)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func TestUpdate(t *testing.T) {
	testCases := []struct {
		name            string
		deps            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		targetName      string
		expectedLabel   string
		expectedCount   int
	}{
		{
			name: "get",
			deps: []runtime.Object{
				&appsv1.Deployment{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "dep1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"k8s-app": "asdf",
						},
					},
					Spec: appsv1.DeploymentSpec{
						Replicas: shared.Int32Ptr(1),
						Selector: &metav1.LabelSelector{
							MatchLabels: map[string]string{
								"k8s-app": "asdf",
							},
						},
					},
				},
			},
			targetNamespace: "namespace1",
			targetName:      "dep1",
			expectedLabel:   "updated",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.deps...)
			err := UpdateDeployment(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName, &appsv1.Deployment{
				ObjectMeta: metav1.ObjectMeta{
					Name:      "dep1",
					Namespace: "namespace1",
					Labels: map[string]string{
						"k8s-app": "asdf",
						"test":    test.expectedLabel,
					},
				},
				Spec: appsv1.DeploymentSpec{
					Replicas: shared.Int32Ptr(1),
					Selector: &metav1.LabelSelector{
						MatchLabels: map[string]string{
							"k8s-app": "asdf",
						},
					},
				},
			})

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			res, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			assert.Equal(t, test.expectedLabel, res.Labels["test"])
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func TestUpdateSpec(t *testing.T) {
	testCases := []struct {
		name            string
		deps            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		targetName      string
		expectedLabel   string
		expectedCount   int
	}{
		{
			name: "get",
			deps: []runtime.Object{
				&appsv1.Deployment{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "dep1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"k8s-app": "asdf",
						},
					},
					Spec: appsv1.DeploymentSpec{
						Replicas: shared.Int32Ptr(1),
						Template: corev1.PodTemplateSpec{
							Spec: corev1.PodSpec{
								Containers: []corev1.Container{
									{
										Name:            "asdf",
										Image:           "asdf:asdf",
										ImagePullPolicy: "asdf",
									},
								},
							},
						},
						Selector: &metav1.LabelSelector{
							MatchLabels: map[string]string{
								"k8s-app": "asdf",
							},
						},
					},
				},
			},
			targetNamespace: "namespace1",
			targetName:      "dep1",
			expectedLabel:   "updated",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.deps...)
			err := UpdateContainerSpec(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName, "asdf", container.ContainerSpec{
				Name: "asdf",
				Image: image.Image{
					Name: "asdf",
					Tag:  "asdf2",
				},
				Ports: []*container.Port{
					{
						ContainerPort: 12,
						HostPort:      12,
						HostIP:        "asdf",
						Protocol:      "TCP",
					},
				},
				EnvVars: []*container.Env{
					{
						Name:  "asdf",
						Value: "asdf",
					},
				},
				CPURequests: 12,
				CPULimit:    15,
				MemRequests: 12,
				MemLimit:    15,
			},
			)

			res, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			assert.Equal(t, "asdf2", res.ContainerSpecs[0].Image.Tag)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func TestDelete(t *testing.T) {
	testCases := []struct {
		name            string
		deps            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		targetName      string
		expectedCount   int
	}{
		{
			name: "delete",
			deps: []runtime.Object{
				&appsv1.Deployment{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "dep1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"k8s-app": "asdf",
						},
					},
					Spec: appsv1.DeploymentSpec{
						Replicas: shared.Int32Ptr(1),
						Selector: &metav1.LabelSelector{
							MatchLabels: map[string]string{
								"k8s-app": "asdf",
							},
						},
					},
				},
			},
			targetNamespace: "namespace1",
			targetName:      "dep1",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.deps...)
			err := Delete(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
		})
	}
}

func TestCreate(t *testing.T) {
	testCases := []struct {
		name            string
		creation        DeploymentCreation
		selector        *types.DataSelector
		targetNamespace string
		targetName      string
		expectedCount   int
	}{
		{
			name: "create",
			creation: DeploymentCreation{
				Name:      "dep1",
				Namespace: "namespace1",
				Replicas:  1,
				ContainerSpecs: []container.ContainerSpec{
					{
						Name: "asdf",
						Image: image.Image{
							Name: "asdf",
							Tag:  "def",
						},
					},
				},
			},
			targetNamespace: "namespace1",
			targetName:      "dep1",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset()
			err := CreateDeployment(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.creation)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			res, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			assert.Equal(t, test.targetName, res.Name)
		})
	}
}

package deployment

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/shared"
	"github.com/tgs266/fleet/lib/types"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestGet(t *testing.T) {
	testCases := []struct {
		name            string
		deps            []runtime.Object
		pods            []runtime.Object
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
			pods: []runtime.Object{
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"k8s-app": "asdf",
						},
					},
					Spec: corev1.PodSpec{
						Containers: []corev1.Container{
							{
								Name:            "asdf",
								Image:           "asdf:asdf",
								ImagePullPolicy: "pp",
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
							},
						},
					},
				},
			},
			selector: &types.DataSelector{
				SortBy: []types.SortBy{
					{
						Property:  types.NameProperty,
						Ascending: false,
					},
					{
						Property:  types.NamespaceProperty,
						Ascending: true,
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
			fakeClientset := fake.NewSimpleClientset(append(test.deps, test.pods...)...)
			res, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			assert.Equal(t, test.targetName, res.Name)
			assert.Equal(t, test.pods[0].(*corev1.Pod).Name, res.Pods[0].Name)
		})
	}
}

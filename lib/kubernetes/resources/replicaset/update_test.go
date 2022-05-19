package replicaset

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"github.com/tgs266/fleet/lib/shared"
	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestRestart(t *testing.T) {
	testCases := []struct {
		name            string
		sets            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		targetName      string
		expectedCount   int
	}{
		{
			sets: []runtime.Object{
				&appsv1.ReplicaSet{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "set1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"k8s-app": "asdf",
						},
					},
					Spec: appsv1.ReplicaSetSpec{
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
			targetName:      "set1",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.sets...)
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

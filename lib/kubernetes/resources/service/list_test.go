package service

import (
	"testing"

	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestListMetas(t *testing.T) {
	testCases := []struct {
		name            string
		services        []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "list_metas",
			services: []runtime.Object{
				&corev1.Service{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "dep1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
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
				},
				Filters: []types.Filter{
					{
						Property: types.NamespaceProperty,
						Operator: types.EqualOperator,
						By:       types.ComparableString("namespace1"),
					},
				},
			},
			targetNamespace: "namespace1",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.services...)
			metas, err := List(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.selector)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if metas.Count != test.expectedCount {
				t.Fatalf("resource count expected %d, got %d", test.expectedCount, metas.Count)
			}

		})
	}
}

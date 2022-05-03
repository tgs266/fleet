package namespace

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/types"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestList(t *testing.T) {
	testCases := []struct {
		name          string
		ns            []runtime.Object
		selector      *types.DataSelector
		expectedCount int
	}{
		{
			name: "list",
			ns: []runtime.Object{
				&corev1.Namespace{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf",
					},
				},
				&corev1.Namespace{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf2",
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
			expectedCount: 2,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.ns...)
			metas, err := List(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.selector)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			assert.Len(t, metas.Items, 2)

		})
	}
}

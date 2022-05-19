package replicaset

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	apps "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestListMetas(t *testing.T) {
	testCases := []struct {
		name            string
		data            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "list1",
			data: []runtime.Object{
				&apps.ReplicaSet{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf",
						Namespace: "asdf",
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
			},
			targetNamespace: "asdf",
			expectedCount:   1,
		},
		{
			name: "list2",
			data: []runtime.Object{
				&apps.ReplicaSet{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf1",
						Namespace: "asdf",
					},
				},
				&apps.ReplicaSet{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf2",
						Namespace: "asdf",
					},
				},
			},
			selector:        nil,
			targetNamespace: "asdf",
			expectedCount:   2,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.data...)
			metas, err := List(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.selector)

			assert.Nil(t, err)
			assert.Len(t, metas.Items, test.expectedCount)

		})
	}
}

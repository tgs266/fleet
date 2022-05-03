package clusterrolebinding

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/types"
	rbac "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestListMetas(t *testing.T) {
	testCases := []struct {
		name            string
		roles           []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "list_binding1",
			roles: []runtime.Object{
				&rbac.ClusterRoleBinding{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf",
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
			name: "list_binding2",
			roles: []runtime.Object{
				&rbac.ClusterRoleBinding{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf1",
					},
				},
				&rbac.ClusterRoleBinding{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf2",
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
			fakeClientset := fake.NewSimpleClientset(test.roles...)
			metas, err := List(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.selector)

			assert.Nil(t, err)
			assert.Len(t, metas.Items, test.expectedCount)

		})
	}
}

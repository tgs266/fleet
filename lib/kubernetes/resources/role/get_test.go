package role

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	rbac "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestGet(t *testing.T) {
	testCases := []struct {
		name            string
		roles           []runtime.Object
		targetName      string
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "list_roles1",
			roles: []runtime.Object{
				&rbac.Role{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf",
						Namespace: "asdf",
					},
				},
			},
			targetName:      "asdf",
			targetNamespace: "asdf",
			expectedCount:   1,
		},
		{
			name: "list_roles1",
			roles: []runtime.Object{
				&rbac.Role{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf1",
						Namespace: "asdf",
					},
				},
				&rbac.Role{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf2",
						Namespace: "asdf",
					},
				},
				&rbac.Role{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf2",
						Namespace: "asdf-different",
					},
				},
			},
			targetName:      "asdf2",
			targetNamespace: "asdf",
			expectedCount:   2,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.roles...)
			role, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			assert.Nil(t, err)
			assert.Equal(t, test.targetNamespace, role.RoleMeta.Namespace)
			assert.Equal(t, test.targetName, role.RoleMeta.Name)

		})
	}
}

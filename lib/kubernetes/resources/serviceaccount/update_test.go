package serviceaccount

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	corev1 "k8s.io/api/core/v1"
	rbac "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestUpdate(t *testing.T) {
	testCases := []struct {
		name            string
		accounts        []runtime.Object
		roleBindings    []runtime.Object
		br              BindRequest
		targetName      string
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "bind1",
			accounts: []runtime.Object{
				&corev1.ServiceAccount{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf",
						Namespace: "asdf",
					},
				},
			},
			roleBindings: []runtime.Object{
				&rbac.RoleBinding{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf-role-binding",
						Namespace: "asdf",
					},
				},
			},
			br: BindRequest{
				TargetRoleName:      "asdf-role-binding",
				TargetRoleNamespace: "asdf",
			},
			targetName:      "asdf",
			targetNamespace: "asdf",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(append(test.accounts, test.roleBindings...)...)
			err := ConnectToRoleBinding(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName, test.br)

			assert.Nil(t, err)
		})
	}
}
func TestUpdateClusterRoleBinding(t *testing.T) {
	testCases := []struct {
		name            string
		accounts        []runtime.Object
		roleBindings    []runtime.Object
		br              BindRequest
		targetName      string
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "bind1",
			accounts: []runtime.Object{
				&corev1.ServiceAccount{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf",
						Namespace: "asdf",
					},
				},
			},
			roleBindings: []runtime.Object{
				&rbac.ClusterRoleBinding{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf-role-binding",
					},
				},
			},
			br: BindRequest{
				TargetRoleName: "asdf-role-binding",
			},
			targetName:      "asdf",
			targetNamespace: "asdf",
			expectedCount:   1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(append(test.accounts, test.roleBindings...)...)
			err := ConnectToClusterRoleBinding(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName, test.br)

			assert.Nil(t, err)
		})
	}
}

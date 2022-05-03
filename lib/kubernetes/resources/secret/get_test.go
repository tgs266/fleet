package secret

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	core "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestGet(t *testing.T) {
	testCases := []struct {
		name            string
		secrets         []runtime.Object
		targetName      string
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "get1",
			secrets: []runtime.Object{
				&core.Secret{
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
			name: "get2",
			secrets: []runtime.Object{
				&core.Secret{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf1",
						Namespace: "asdf",
					},
				},
				&core.Secret{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "asdf2",
						Namespace: "asdf",
					},
				},
				&core.Secret{
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
			fakeClientset := fake.NewSimpleClientset(test.secrets...)
			secret, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			assert.Nil(t, err)
			assert.Equal(t, test.targetNamespace, secret.SecretMeta.Namespace)
			assert.Equal(t, test.targetName, secret.SecretMeta.Name)

		})
	}
}

package node

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/test/mock"
	"github.com/tgs266/fleet/lib/types"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestGet(t *testing.T) {
	pods := []*corev1.Pod{
		mock.GeneratePod(mock.PodMock{
			Name:           "asdf1",
			Namespace:      "asdf",
			AppLabel:       "asdf1",
			ContainerCount: 3,
		}),
		mock.GeneratePod(mock.PodMock{
			Name:           "asdf2",
			Namespace:      "asdf",
			AppLabel:       "asdf2",
			ContainerCount: 3,
		}),
	}

	pods[0].CreationTimestamp = metav1.Now()
	pods[0].Spec.NodeName = "asdf"
	pods[0].Status.Phase = corev1.PodRunning
	pods[1].CreationTimestamp = metav1.Now()
	pods[1].Spec.NodeName = "asdf"
	pods[1].Status.Phase = corev1.PodRunning

	testCases := []struct {
		name            string
		nodes           []runtime.Object
		pods            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "get",
			nodes: []runtime.Object{
				&corev1.Node{
					ObjectMeta: metav1.ObjectMeta{
						Name: "asdf",
					},
				},
			},
			pods: []runtime.Object{
				pods[0], pods[1],
			},
			selector: &types.DataSelector{
				SortBy: []types.SortBy{
					{
						Property:  types.CreatedAtProperty,
						Ascending: false,
					},
				},
			},
			expectedCount: 1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(append(test.nodes, test.pods...)...)
			node, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, "asdf", test.selector)

			assert.Nil(t, err)
			assert.Equal(t, "asdf", node.Name)

		})
	}
}

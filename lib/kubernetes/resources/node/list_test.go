package node

import (
	"testing"

	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/test/mock"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestListMetas(t *testing.T) {
	pods := []*corev1.Pod{
		mock.GeneratePod(mock.PodMock{
			Name:           "asdf1",
			Namespace:      "asdf",
			AppLabel:       "asdf1",
			ContainerCount: 2,
		}),
		mock.GeneratePod(mock.PodMock{
			Name:           "asdf2",
			Namespace:      "asdf",
			AppLabel:       "asdf2",
			ContainerCount: 4,
		}),
	}

	pods[0].Spec = corev1.PodSpec{
		NodeName: "asdf",
	}
	pods[1].Spec = corev1.PodSpec{
		NodeName: "asdf",
	}

	testCases := []struct {
		name            string
		nodes           []runtime.Object
		pods            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "list_metas",
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
			expectedCount: 1,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(append(test.nodes, test.pods...)...)
			metas, err := List(&kubernetes.K8Client{
				K8: fakeClientset,
			})

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if len(metas) != test.expectedCount {
				t.Fatalf("resource count expected %d, got %d", test.expectedCount, len(metas))
			}

		})
	}
}

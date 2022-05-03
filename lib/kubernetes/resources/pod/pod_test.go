package pod

import (
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources"
	"github.com/tgs266/fleet/lib/kubernetes/test/mock"
	"github.com/tgs266/fleet/lib/logging"
	"github.com/tgs266/fleet/lib/types"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/resource"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/kubernetes/fake"
)

func TestMain(m *testing.M) {
	logging.Init(logging.LVL_INFO)
	code := m.Run()
	os.Exit(code)
}
func TestListStubs(t *testing.T) {
	testCases := []struct {
		name            string
		pods            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "list_stubs",
			pods: []runtime.Object{
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod2",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod3",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
			},
			selector:        new(types.DataSelector),
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "list_stubs2",
			pods: []runtime.Object{
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod2",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod3",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
			},
			selector:        nil,
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "list_stubs3",
			pods: []runtime.Object{
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod2",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod3",
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
			},
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.pods...)
			stubs, err := ListStubs(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.selector)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if stubs.Count != test.expectedCount {
				t.Fatalf("pod count expected %d, got %d", test.expectedCount, stubs.Count)
			}

		})
	}
}
func TestListStubsSort(t *testing.T) {
	testCases := []struct {
		name            string
		pods            []runtime.Object
		selector        *types.DataSelector
		targetNamespace string
		firstName       string
		expectedCount   int
	}{
		{
			name: "list_stubs3",
			pods: []runtime.Object{
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "a",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "b",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "c",
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
			},
			targetNamespace: "namespace1",
			firstName:       "a",
			expectedCount:   3,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.pods...)
			stubs, err := ListStubs(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.selector)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if stubs.Items.([]PodMeta)[0].Name != test.firstName {
				t.Fatalf("pod first name expected %s, got %s", test.firstName, stubs.Items.([]PodMeta)[0].Name)
			}

		})
	}
}
func TestGet(t *testing.T) {
	testCases := []struct {
		name            string
		pods            []runtime.Object
		targetName      string
		targetNamespace string
		genericStatus   resources.GenericStatus
		expectedCount   int
	}{
		{
			name: "get_pod",
			pods: []runtime.Object{
				mock.GeneratePod(mock.PodMock{
					Name:           "pod1",
					Namespace:      "namespace1",
					ContainerCount: 3,
					AppLabel:       "asdf",
				}),
			},
			genericStatus:   resources.PENDING_STATUS,
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "get_pod2",
			pods: func() []runtime.Object {
				mock := mock.GeneratePod(mock.PodMock{
					Name:           "pod1",
					Namespace:      "namespace1",
					ContainerCount: 3,
					AppLabel:       "asdf",
				})
				mock.Status.InitContainerStatuses[0] = mock.Status.InitContainerStatuses[2]
				mock.Spec.Overhead = corev1.ResourceList{
					corev1.ResourceCPU:    *resource.NewMilliQuantity(int64(10), resource.DecimalSI),
					corev1.ResourceMemory: *resource.NewQuantity(int64(10), resource.DecimalSI),
				}
				return []runtime.Object{mock}
			}(),
			genericStatus:   resources.TERMINATED_STATUS,
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "get_pod_terminated",
			pods: func() []runtime.Object {
				mock := mock.GeneratePod(mock.PodMock{
					Name:           "pod1",
					Namespace:      "namespace1",
					ContainerCount: 3,
					AppLabel:       "asdf",
				})
				mock.Status.InitContainerStatuses = []corev1.ContainerStatus{}
				mock.Status.ContainerStatuses = []corev1.ContainerStatus{
					{
						Name: "asdf",
						State: corev1.ContainerState{
							Terminated: &corev1.ContainerStateTerminated{
								ExitCode: 12,
								Reason:   "Because",
							},
						},
					},
				}
				return []runtime.Object{mock}
			}(),
			genericStatus:   resources.TERMINATED_STATUS,
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "get_pod_running",
			pods: func() []runtime.Object {
				mock := mock.GeneratePod(mock.PodMock{
					Name:           "pod1",
					Namespace:      "namespace1",
					ContainerCount: 3,
					AppLabel:       "asdf",
				})
				mock.Status.InitContainerStatuses = []corev1.ContainerStatus{}
				mock.Status.ContainerStatuses = []corev1.ContainerStatus{
					{
						Ready: true,
						Name:  "asdf",
						State: corev1.ContainerState{
							Running: &corev1.ContainerStateRunning{},
						},
					},
					{
						Name: "asdf",
						State: corev1.ContainerState{
							Terminated: &corev1.ContainerStateTerminated{
								Reason:   "Completed",
								ExitCode: 0,
							},
						},
					},
				}
				mock.Status.Conditions = []corev1.PodCondition{
					{
						Type:   corev1.PodReady,
						Status: corev1.ConditionTrue,
					},
				}
				return []runtime.Object{mock}
			}(),
			genericStatus:   resources.RUNNING_STATUS,
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "get_pod_running_no_ready_cond",
			pods: func() []runtime.Object {
				mock := mock.GeneratePod(mock.PodMock{
					Name:           "pod1",
					Namespace:      "namespace1",
					ContainerCount: 3,
					AppLabel:       "asdf",
				})
				mock.Status.InitContainerStatuses = []corev1.ContainerStatus{}
				mock.Status.ContainerStatuses = []corev1.ContainerStatus{
					{
						Ready: true,
						Name:  "asdf",
						State: corev1.ContainerState{
							Running: &corev1.ContainerStateRunning{},
						},
					},
					{
						Name: "asdf",
						State: corev1.ContainerState{
							Terminated: &corev1.ContainerStateTerminated{
								Reason:   "Completed",
								ExitCode: 0,
							},
						},
					},
				}
				return []runtime.Object{mock}
			}(),
			genericStatus:   resources.RUNNING_STATUS,
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
		{
			name: "get_pod_running_node_lost",
			pods: func() []runtime.Object {
				mock := mock.GeneratePod(mock.PodMock{
					Name:           "pod1",
					Namespace:      "namespace1",
					ContainerCount: 3,
					AppLabel:       "asdf",
				})
				mock.Status.InitContainerStatuses = []corev1.ContainerStatus{}
				mock.Status.ContainerStatuses = []corev1.ContainerStatus{
					{
						Name: "asdf",
						State: corev1.ContainerState{
							Terminated: &corev1.ContainerStateTerminated{
								Reason:   "",
								ExitCode: 0,
							},
						},
					},
				}
				mock.Status.Reason = "NodeLost"
				mock.DeletionTimestamp = &metav1.Time{
					Time: time.Now(),
				}
				return []runtime.Object{mock}
			}(),
			genericStatus:   resources.UNKNOWN_STATUS,
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.pods...)
			res, err := Get(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if res.Name != test.targetName {
				t.Fatalf("pod name expected %s, got %s", test.targetName, res.Name)
			}

			assert.Equal(t, test.genericStatus, res.Status.GenericStatus)

		})
	}
}
func TestDelete(t *testing.T) {
	testCases := []struct {
		name            string
		pods            []runtime.Object
		targetName      string
		targetNamespace string
		expectedCount   int
	}{
		{
			name: "delete_pod",
			pods: []runtime.Object{
				&corev1.Pod{
					ObjectMeta: metav1.ObjectMeta{
						Name:      "pod1",
						Namespace: "namespace1",
						Labels: map[string]string{
							"label1": "value1",
						},
					},
				},
			},
			targetName:      "pod1",
			targetNamespace: "namespace1",
			expectedCount:   3,
		},
	}

	for _, test := range testCases {
		t.Run(test.name, func(t *testing.T) {
			fakeClientset := fake.NewSimpleClientset(test.pods...)
			err := Delete(&kubernetes.K8Client{
				K8: fakeClientset,
			}, test.targetNamespace, test.targetName)

			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

		})
	}
}

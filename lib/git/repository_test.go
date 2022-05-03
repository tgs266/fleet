package git

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/shared"
	appsv1 "k8s.io/api/apps/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func TestGetHist(t *testing.T) {
	os.RemoveAll(".fleet-test/git")
	m := New(".fleet-test/git")
	r, err := m.CreateRepository("test", "asdf")
	assert.Nil(t, err)
	r.Commit("asdf",
		&appsv1.Deployment{
			ObjectMeta: metav1.ObjectMeta{
				Name:      "dep1",
				Namespace: "namespace1",
				Labels: map[string]string{
					"label1": "value1",
				},
			},
			Spec: appsv1.DeploymentSpec{
				Replicas: shared.Int32Ptr(1),
			},
		},
		"asdf",
	)

	hist, err := r.History(HistoryRequest{
		PageSize: 20,
		Offset:   0,
	})
	assert.Nil(t, err)
	assert.Len(t, hist, 1)
	os.RemoveAll(".fleet-test")
}

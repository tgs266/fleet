package helm

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/storage"
	"helm.sh/helm/v3/pkg/storage/driver"
	"helm.sh/helm/v3/pkg/time"
)

func storageFixture() *storage.Storage {
	return storage.Init(driver.NewMemory())
}

func TestSearch(t *testing.T) {

	repoFile := "../testdata/helm/repos.yaml"
	repoCache := "../testdata/helm/repository"

	manager, err := New()
	assert.Nil(t, err)
	manager.settings.RepositoryConfig = repoFile
	manager.settings.RepositoryCache = repoCache

	_, e := manager.Search(&types.DataSelector{
		Filters: types.Filters{
			{
				Property: types.NameProperty,
				By:       types.ComparableString("prom"),
				Operator: types.ContainsOperation,
			},
		},
	})
	assert.Nil(t, e)
}

func TestSearchRelease(t *testing.T) {

	sampleTimeSeconds := int64(1452902400)
	timestamp1 := time.Unix(sampleTimeSeconds+1, 0).UTC()
	defaultNamespace := "default"
	chartInfo := &chart.Chart{
		Metadata: &chart.Metadata{
			Name:       "name",
			Version:    "1.0.0",
			AppVersion: "0.0.1",
		},
	}
	rel := &release.Release{
		Name:      "asdf",
		Version:   1,
		Namespace: defaultNamespace,
		Info: &release.Info{
			LastDeployed: timestamp1,
			Status:       release.StatusSuperseded,
		},
		Chart: chartInfo,
	}

	storage := storageFixture()
	if err := storage.Create(rel); err != nil {
		t.Fatal(err)
	}

	m, _ := New()
	m.cfg.Releases = storage

	_, e := m.SearchReleases(&types.DataSelector{
		Filters: types.Filters{
			{
				Property: types.NameProperty,
				By:       types.ComparableString("asdf"),
				Operator: types.ContainsOperation,
			},
		},
	})
	assert.Nil(t, e)

}

func TestGetRelease(t *testing.T) {

	sampleTimeSeconds := int64(1452902400)
	timestamp1 := time.Unix(sampleTimeSeconds+1, 0).UTC()
	defaultNamespace := "default"
	chartInfo := &chart.Chart{
		Metadata: &chart.Metadata{
			Name:       "name",
			Version:    "1.0.0",
			AppVersion: "0.0.1",
		},
	}
	rel := &release.Release{
		Name:      "asdf",
		Version:   1,
		Namespace: defaultNamespace,
		Info: &release.Info{
			LastDeployed: timestamp1,
			Status:       release.StatusDeployed,
		},
		Chart: chartInfo,
	}

	storage := storageFixture()
	if err := storage.Create(rel); err != nil {
		t.Fatal(err)
	}

	m, _ := New()
	m.cfg.Releases = storage

	_, e := m.GetRelease("asdf")
	assert.Nil(t, e)

}

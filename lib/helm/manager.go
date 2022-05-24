package helm

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes/types"
	"gopkg.in/yaml.v3"
	"helm.sh/helm/v3/cmd/helm/search"
	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/chart"
	"helm.sh/helm/v3/pkg/chart/loader"
	"helm.sh/helm/v3/pkg/cli"
	"helm.sh/helm/v3/pkg/cli/values"
	"helm.sh/helm/v3/pkg/downloader"
	"helm.sh/helm/v3/pkg/getter"
	"helm.sh/helm/v3/pkg/helmpath"
	"helm.sh/helm/v3/pkg/repo"
)

type Manager struct {
	cache    *HelmCache
	settings *cli.EnvSettings
	cfg      *action.Configuration
}

var cache = &HelmCache{}

func New() (*Manager, error) {
	settings := cli.New()
	actionConfig := new(action.Configuration)
	if err := actionConfig.Init(settings.RESTClientGetter(), settings.Namespace(), os.Getenv("HELM_DRIVER"), log.Printf); err != nil {
		return nil, err
	}
	return &Manager{
		cache:    cache,
		settings: settings,
		cfg:      actionConfig,
	}, nil
}

func (self *Manager) LoadCharts() error {

	o := &searchOptions{}

	o.repoFile = self.settings.RepositoryConfig
	o.repoCacheDir = self.settings.RepositoryCache

	rf, err := repo.LoadFile(o.repoFile)
	if err != nil {
		return err
	}

	i := search.NewIndex()
	for _, re := range rf.Repositories {
		n := re.Name
		f := filepath.Join(o.repoCacheDir, helmpath.CacheIndexFile(n))
		ind, err := repo.LoadIndexFile(f)
		if err != nil {
			continue
		}

		i.AddRepo(n, ind, o.versions || len(o.version) > 0)
	}

	res := i.All()

	data, err := o.applyConstraint(res)
	if err != nil {
		return err
	}

	output := []*Chart{}

	for _, d := range data {
		output = append(output, &Chart{
			ChartVersion: d.Chart,
			Repo:         strings.Split(d.Name, "/")[0],
		})
	}

	self.cache.setCharts(output)
	return nil
}
func (self *Manager) SearchReleases(ds *types.DataSelector) (*types.PaginationResponse, error) {
	client := action.NewList(self.cfg)
	results, err := client.Run()
	if err != nil {
		return nil, err
	}
	comps := ToReleaseComparable(results)
	ds.Execute(comps)
	results = FromReleaseComparable(ds.Items)

	resp := &types.PaginationResponse{
		Items:  results,
		Count:  len(results),
		Total:  ds.TotalItemCount,
		Offset: ds.Offset,
	}
	return resp, nil
}

func (self *Manager) Search(ds *types.DataSelector) (*types.PaginationResponse, error) {
	if self.cache.isEmpty() {
		err := self.LoadCharts()
		if err != nil {
			return nil, err
		}
	} else {
		defer func() { go self.LoadCharts() }()
	}

	comps := ToChartComparable(self.cache.Charts)
	ds.Execute(comps)
	items := FromChartComparable(ds.Items)

	resp := &types.PaginationResponse{
		Items:  items,
		Count:  len(items),
		Total:  ds.TotalItemCount,
		Offset: ds.Offset,
	}

	return resp, nil
}

func (self *Manager) getReadme(repo, name string) (string, error) {
	client := action.NewShowWithConfig(action.ShowAll, self.cfg)
	client.OutputFormat = action.ShowReadme
	cp, err := client.ChartPathOptions.LocateChart(repo+"/"+name, self.settings)
	if err != nil {
		return "", err
	}
	res, err := client.Run(cp)
	if err != nil {
		return "", err
	}
	return res, nil
}

func (self *Manager) getValues(repo, name string) (string, error) {
	client := action.NewShowWithConfig(action.ShowAll, self.cfg)
	client.OutputFormat = action.ShowValues
	cp, err := client.ChartPathOptions.LocateChart(repo+"/"+name, self.settings)
	if err != nil {
		return "", err
	}
	res, err := client.Run(cp)
	if err != nil {
		return "", err
	}
	return res, nil
}

func (self *Manager) Get(repo, name string) (*Chart, error) {

	readme, err := self.getReadme(repo, name)
	if err != nil {
		return nil, err
	}

	values, err := self.getValues(repo, name)
	if err != nil {
		return nil, err
	}

	if self.cache.isEmpty() {
		err := self.LoadCharts()
		if err != nil {
			return nil, err
		}
	}

	for _, chart := range self.cache.Charts {
		if chart.Repo == repo && chart.Name == name {
			chart.Readme = readme
			chart.Values = values
			return chart, nil
		}
	}

	return nil, errors.NewResourceNotFoundError("helm chart", repo+"/"+name)
}

func (self *Manager) GetRelease(name string) (*Release, error) {

	client := action.NewList(self.cfg)
	results, err := client.Run()
	if err != nil {
		return nil, err
	}

	ds := &types.DataSelector{
		Filters: types.Filters{
			{
				Property: types.NameProperty,
				By:       types.ComparableString(name),
				Operator: types.EqualOperator,
			},
		},
	}

	comps := ToReleaseComparable(results)
	ds.Execute(comps)
	results = FromReleaseComparable(ds.Items)

	if len(results) == 0 {
		return nil, errors.NewResourceNotFoundError("helm release", name)
	}

	data := results[0]
	out := []map[string]interface{}{}

	for _, s := range strings.Split(data.Manifest, "---") {
		var temp map[string]interface{}
		err = yaml.Unmarshal([]byte(s), &temp)
		if err == nil && temp != nil {
			out = append(out, temp)
		}
	}

	return &Release{
		Release:   data,
		Resources: out,
	}, nil
}

func checkIfInstallable(ch *chart.Chart) error {
	switch ch.Metadata.Type {
	case "", "application":
		return nil
	}
	return errors.CreateError(500, fmt.Sprintf("%s charts are not installable", ch.Metadata.Type))
}

func (self *Manager) Install(request InstallRequest) error {
	client := action.NewInstall(self.cfg)
	valueOpts := &values.Options{
		Values: []string{request.Values},
	}

	client.ReleaseName = request.ReleaseName
	client.ChartPathOptions.Version = request.Version

	cp, err := client.ChartPathOptions.LocateChart(request.Repo+"/"+request.ChartName, self.settings)
	if err != nil {
		return err
	}

	p := getter.All(self.settings)
	vals, err := valueOpts.MergeValues(p)
	if err != nil {
		return err
	}

	chartRequested, err := loader.Load(cp)
	if err != nil {
		return err
	}

	if err := checkIfInstallable(chartRequested); err != nil {
		return err
	}

	if req := chartRequested.Metadata.Dependencies; req != nil {
		// If CheckDependencies returns an error, we have unfulfilled dependencies.
		// As of Helm 2.4.0, this is treated as a stopping condition:
		// https://github.com/helm/helm/issues/2209
		if err := action.CheckDependencies(chartRequested, req); err != nil {
			err = errors.ParseInternalError(err)
			if client.DependencyUpdate {
				man := &downloader.Manager{
					ChartPath:        cp,
					Keyring:          client.ChartPathOptions.Keyring,
					SkipUpdate:       false,
					Getters:          p,
					RepositoryConfig: self.settings.RepositoryConfig,
					RepositoryCache:  self.settings.RepositoryCache,
					Debug:            self.settings.Debug,
				}
				if err := man.Update(); err != nil {
					return err
				}
				// Reload the chart with the updated Chart.lock file.
				if chartRequested, err = loader.Load(cp); err != nil {
					return errors.ParseInternalError(err)
				}
			} else {
				return err
			}
		}
	}

	client.Namespace = request.Namespace

	ctx := context.Background()
	ctx, cancel := context.WithCancel(ctx)

	// Set up channel on which to send signal notifications.
	// We must use a buffered channel or risk missing the signal
	// if we're not ready to receive when the signal is sent.
	cSignal := make(chan os.Signal, 2)
	signal.Notify(cSignal, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-cSignal
		cancel()
	}()

	_, err = client.RunWithContext(ctx, chartRequested, vals)
	return err
}

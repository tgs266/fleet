package helm

import (
	"github.com/Masterminds/semver/v3"
	"github.com/pkg/errors"
	"helm.sh/helm/v3/cmd/helm/search"
)

type searchOptions struct {
	versions     bool
	regexp       bool
	devel        bool
	version      string
	repoFile     string
	repoCacheDir string
}

const searchMaxScore = 25

func (o *searchOptions) applyConstraint(res []*search.Result) ([]*search.Result, error) {
	if o.version == "" {
		return res, nil
	}

	constraint, err := semver.NewConstraint(o.version)
	if err != nil {
		return res, errors.Wrap(err, "an invalid version/constraint format")
	}

	data := res[:0]
	foundNames := map[string]bool{}
	for _, r := range res {
		// if not returning all versions and already have found a result,
		// you're done!
		if !o.versions && foundNames[r.Name] {
			continue
		}
		v, err := semver.NewVersion(r.Chart.Version)
		if err != nil {
			continue
		}
		if constraint.Check(v) {
			data = append(data, r)
			foundNames[r.Name] = true
		}
	}

	return data, nil
}

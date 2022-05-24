package helm

import (
	"helm.sh/helm/v3/pkg/release"
	"helm.sh/helm/v3/pkg/repo"
)

type Chart struct {
	*repo.ChartVersion `json:",inline"`
	Repo               string `json:"repo"`
	Readme             string `json:"readme"`
	Values             string `json:"values"`
}

type Release struct {
	*release.Release `json:",inline"`
	Resources        []map[string]interface{} `json:"resources"`
}

type InstallRequest struct {
	Repo        string `json:"repo"`
	ChartName   string `json:"chartName"`
	ReleaseName string `json:"releaseName"`
	Version     string `json:"version"`
	Values      string `json:"values"`
	Namespace   string `json:"namespace"`
}

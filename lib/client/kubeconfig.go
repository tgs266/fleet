package client

import (
	"os"

	"gopkg.in/yaml.v2"
)

type contextInfo struct {
	User string `yaml:"user"`
}

type contextEntry struct {
	Name    string      `yaml:"name"`
	Context contextInfo `yaml:"context"`
}

type userEntry struct {
	Name string   `yaml:"name"`
	User userInfo `yaml:"user"`
}

type authProviderConfig struct {
	AccessToken string `yaml:"access-token"`
}

type authProviderInfo struct {
	Config authProviderConfig `yaml:"config"`
}

type userInfo struct {
	AuthProvider authProviderInfo `yaml:"auth-provider"`
	Token        string           `yaml:"token"`
	Username     string           `yaml:"username"`
	Password     string           `yaml:"password"`
}

type kubeConfig struct {
	Contexts       []contextEntry `yaml:"contexts"`
	CurrentContext string         `yaml:"current-context"`
	Users          []userEntry    `yaml:"users"`
}

func parseKubeConfig(path string) (*kubeConfig, error) {
	dat, _ := os.ReadFile(path)
	kubeConfig := new(kubeConfig)
	if err := yaml.Unmarshal(dat, kubeConfig); err != nil {
		return nil, err
	}

	return kubeConfig, nil

}

func ParseKubeConfig(fileData string) (*kubeConfig, error) {
	kubeConfig := new(kubeConfig)
	if err := yaml.Unmarshal([]byte(fileData), kubeConfig); err != nil {
		return nil, err
	}
	return kubeConfig, nil
}

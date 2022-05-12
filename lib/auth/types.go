package auth

import (
	"github.com/tgs266/fleet/lib/errors"
	"k8s.io/client-go/tools/clientcmd/api"

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

func parseKubeConfig(fileData string) (*kubeConfig, error) {
	kubeConfig := new(kubeConfig)
	if err := yaml.Unmarshal([]byte(fileData), kubeConfig); err != nil {
		return nil, err
	}
	return kubeConfig, nil
}

type LoginRequest struct {
	Username   string `json:"username"`
	Password   string `json:"password"`
	Token      string `json:"token"`
	ConfigFile string `json:"configFile"`
}

type RefreshRequest struct {
	Token string `json:"token"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

func (request LoginRequest) GetAuthInfo() (*api.AuthInfo, error) {
	if len(request.Token) > 0 {
		return &api.AuthInfo{
			Token: request.Token,
		}, nil
	} else if len(request.Username) > 0 && len(request.Password) > 0 {
		return &api.AuthInfo{
			Username: request.Username,
			Password: request.Password,
		}, nil
	} else if len(request.ConfigFile) > 0 {
		config, err := parseKubeConfig(request.ConfigFile)
		if err != nil {
			return nil, err
		}
		userName := ""
		for _, context := range config.Contexts {
			if context.Name == config.CurrentContext {
				userName = context.Context.User
			}
		}

		if len(userName) == 0 {
			return nil, errors.CreateError(404, "No user found")
		}

		var userData userEntry
		for _, user := range config.Users {
			if user.Name == userName {
				userData = user
			}
		}

		if len(userData.User.Token) == 0 {
			userData.User.Token = userData.User.AuthProvider.Config.AccessToken
		}

		if userData.User.Username == "" {
			userData.User.Username = userData.Name
		}

		return &api.AuthInfo{
			Username: userData.User.Username,
			Password: userData.User.Password,
			Token:    userData.User.Token,
		}, nil
	}
	return nil, errors.CreateError(400, "not enough info provided to authenticate user")
}

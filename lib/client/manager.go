package client

import (
	"context"
	errs "errors"
	"os"
	"path/filepath"
	"regexp"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/auth"
	"github.com/tgs266/fleet/lib/auth/oidc"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/git"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/logging"
	"github.com/tgs266/fleet/lib/raw"
	authv1 "k8s.io/api/authentication/v1"
	k8errors "k8s.io/apimachinery/pkg/api/errors"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
	"k8s.io/client-go/util/homedir"
)

type ClientManager struct {
	TestMode     bool
	TestAuthMode bool

	// path to kubernetes config
	kubeConfigPath string

	// cluster cfg to use if config path not provided
	clusterConfig *rest.Config

	UseAuth bool

	authManager *auth.AuthManager
	oidcManager *oidc.OIDCManager
	gitManager  *git.GitManager
}

func usernameFromError(err error) string {
	re := regexp.MustCompile(`^.* User "(.*)" cannot .*$`)
	return re.ReplaceAllString(err.Error(), "$1")
}

func usernameFromSA(name string) string {
	const groups = 5
	const nameGroupIdx = 4
	re := regexp.MustCompile(`(?P<ignore>[\w-]+):(?P<type>[\w-]+):(?P<namespace>[\w-_]+):(?P<name>[\w-]+)`)
	match := re.FindStringSubmatch(name)

	if match == nil || len(match) != groups {
		return name
	}

	return match[nameGroupIdx]
}

func NewClientManager(useAuth bool, gitPath string) *ClientManager {

	kubeConfigPath := filepath.Join(homedir.HomeDir(), ".kube", "config")
	if _, err := os.Stat(kubeConfigPath); errs.Is(err, os.ErrNotExist) {
		kubeConfigPath = ""
	}

	var authManager *auth.AuthManager
	if useAuth {
		authManager = auth.New()
	}

	var gitManager *git.GitManager
	if gitPath != "" {
		gitManager = git.New(gitPath)
	}

	client := &ClientManager{
		kubeConfigPath: kubeConfigPath,
		UseAuth:        useAuth,
		authManager:    authManager,
		gitManager:     gitManager,
	}

	client.init()
	return client
}

func (client *ClientManager) InitializeOIDC(config oidc.OIDCConfig) error {
	logging.INFO("initializing OIDC integration with issuer url " + config.IssuerURL)
	o := &oidc.OIDCManager{}
	err := o.Init(config)
	client.oidcManager = o
	return err
}

func (client *ClientManager) OIDCCallback(c *fiber.Ctx) (string, error) {
	return client.oidcManager.Callback(c)
}

func (client *ClientManager) OIDCUrl(c *fiber.Ctx) string {
	return client.oidcManager.GetOIDCUrl(c)
}

func (client *ClientManager) init() {
	client.initClusterConfig()
}

func (client *ClientManager) initClusterConfig() {
	if client.kubeConfigPath != "" {
		return
	}
	logging.INFO("attempting in-cluster config")
	cfg, err := rest.InClusterConfig()
	if err != nil {
		logging.WARN("in-cluster config failed")
	}
	client.clusterConfig = cfg

}

func (client *ClientManager) getK8Client(c *fiber.Ctx) (*kubernetes.K8Client, error) {

	if client.TestMode {
		return kubernetes.GetTestClient(), nil
	}

	k8client := new(kubernetes.K8Client)
	cfg, err := client.buildConfig()
	if err != nil && !client.TestAuthMode {
		return nil, err
	}

	if client.UseAuth {
		authInfo, err := client.getAuthInfo(c)
		if err != nil && !client.TestAuthMode {
			return nil, err
		}

		cfg, err = client.Wrap(authInfo, cfg)
		if err != nil && !client.TestAuthMode {
			return nil, err
		}

		username, err := client.ValidateAuthInfo(cfg, authInfo)
		c.Response().Header.Add("Username", username)
		if err != nil && !client.TestAuthMode {
			return nil, errors.NewInvalidKubernetesCredentials()
		}
	} else if client.clusterConfig == nil {
		kubeCfg, _ := parseKubeConfig(client.kubeConfigPath)
		username := ""
		for _, context := range kubeCfg.Contexts {
			if context.Name == kubeCfg.CurrentContext {
				username = context.Context.User
			}
		}
		c.Response().Header.Add("Username", username)
	}

	return k8client, k8client.Connect(cfg)
}

func (client *ClientManager) getAuthInfo(c *fiber.Ctx) (*api.AuthInfo, error) {
	if err := client.authManager.HasAuthHeaders(c); err != nil {
		return nil, err
	}
	authInfo, err := client.authManager.ExtractAuthInfo(c)
	if err != nil {
		if client.TestAuthMode {
			return &api.AuthInfo{
				Token: "asdf",
			}, nil
		}
		return nil, err
	}
	return authInfo, nil
}

func (client *ClientManager) buildConfig() (*rest.Config, error) {
	if client.kubeConfigPath != "" {
		config, err := clientcmd.BuildConfigFromFlags("", client.kubeConfigPath)
		if err != nil {
			return nil, errors.NewConfigInitializationError(err)
		}
		return config, nil
	}

	if client.clusterConfig != nil {
		return client.clusterConfig, nil
	}

	return nil, errors.NewConfigInitializationError(nil)
}

func (client *ClientManager) Wrap(authInfo *api.AuthInfo, cfg *rest.Config) (*rest.Config, error) {

	cmdCfg := api.NewConfig()
	if cfg != nil {
		cmdCfg.Clusters["kubernetes"] = &api.Cluster{
			Server:                   cfg.Host,
			CertificateAuthority:     cfg.TLSClientConfig.CAFile,
			CertificateAuthorityData: cfg.TLSClientConfig.CAData,
			InsecureSkipTLSVerify:    cfg.TLSClientConfig.Insecure,
		}
	}
	cmdCfg.AuthInfos["kubernetes"] = authInfo
	cmdCfg.Contexts["kubernetes"] = &api.Context{
		Cluster:  "kubernetes",
		AuthInfo: "kubernetes",
	}
	cmdCfg.CurrentContext = "kubernetes"

	restCfg, err := clientcmd.NewDefaultClientConfig(
		*cmdCfg,
		&clientcmd.ConfigOverrides{},
	).ClientConfig()
	return restCfg, err
}

func (client *ClientManager) Encode(token string) (*auth.LoginResponse, error) {
	return client.authManager.Encode(&api.AuthInfo{
		Token: token,
	})
}

func (client *ClientManager) Authenticate(request auth.LoginRequest) (*auth.LoginResponse, error) {
	return client.authManager.Login(request)
}

func (client *ClientManager) RefreshToken(request auth.RefreshRequest) (*auth.LoginResponse, error) {
	return client.authManager.Refresh(request)
}

func (client *ClientManager) Client(c *fiber.Ctx) (*kubernetes.K8Client, error) {
	k8client, err := client.getK8Client(c)
	if err != nil {
		return nil, err
	}
	return k8client, err
}

func (client *ClientManager) RawClient(c *fiber.Ctx) (*raw.Client, error) {
	k8client, err := client.getK8Client(c)
	if err != nil {
		return nil, err
	}
	if client.TestMode {
		return raw.BuildClient(
			nil,
			nil,
			nil,
		), nil
	}
	return raw.BuildClient(
		k8client.K8.CoreV1().RESTClient(),
		k8client.K8.AppsV1().RESTClient(),
		k8client.K8.RbacV1().RESTClient(),
	), nil
}

func (self *ClientManager) ValidateAuthInfo(cfg *rest.Config, authInfo *api.AuthInfo) (string, error) {
	k8client := new(kubernetes.K8Client)

	err := k8client.Connect(cfg)
	if err != nil && !self.TestAuthMode {
		return "", err
	}

	var result *authv1.TokenReview
	if !self.TestAuthMode {
		result, err = k8client.K8.AuthenticationV1().TokenReviews().Create(context.TODO(), &authv1.TokenReview{
			Spec: authv1.TokenReviewSpec{
				Token: authInfo.Token,
			},
		}, metaV1.CreateOptions{})
	} else {
		err = errors.NewConfigInitializationError(nil)
	}

	if err != nil {
		// valid token, but you cant access anything
		if k8errors.IsForbidden(err) {
			return usernameFromError(err), nil
		}

		return "", err
	}
	return usernameFromSA(result.Status.User.Username), nil
}

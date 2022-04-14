package client

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/raw"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

type ClientManager struct {

	// path to kubernetes config
	kubeConfigPath string

	// cluster cfg to use if config path not provided
	clusterConfig *rest.Config
}

func NewClientManager(kubeConfigPath string) *ClientManager {

	client := &ClientManager{
		kubeConfigPath: kubeConfigPath,
	}

	client.init()
	return client
}

func (client *ClientManager) init() {
	client.initClusterConfig()
}

func (client *ClientManager) initClusterConfig() {
	if client.kubeConfigPath != "" {
		return
	}
	cfg, err := rest.InClusterConfig()
	if err != nil {
		return
	}
	client.clusterConfig = cfg

}

func (client *ClientManager) getK8Client() (*kubernetes.K8Client, error) {
	k8client := new(kubernetes.K8Client)
	cfg, err := client.buildConfig()
	if err != nil {
		return nil, err
	}
	return k8client, k8client.Connect(cfg)
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

func (client *ClientManager) Client() (*kubernetes.K8Client, error) {
	k8client, err := client.getK8Client()
	if err != nil {
		return nil, err
	}
	return k8client, err
}

func (client *ClientManager) RawClient() (*raw.Client, error) {
	k8client, err := client.getK8Client()
	if err != nil {
		return nil, err
	}
	return raw.BuildClient(
		k8client.K8.CoreV1().RESTClient(),
		k8client.K8.AppsV1().RESTClient(),
	), err
}
package kubernetes

import (
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	metrics "k8s.io/metrics/pkg/client/clientset/versioned"
)

type K8Client struct {
	K8              *kubernetes.Clientset
	Metrics         *metrics.Clientset
	ConnectionError error
}

func (K8 *K8Client) Connect(config *rest.Config) error {
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return err
	}
	K8.K8 = clientset
	K8.connectMetrics(config)
	return nil
}

func (K8 *K8Client) connectMetrics(cfg *rest.Config) {
	clientset, _ := metrics.NewForConfig(cfg)
	K8.Metrics = clientset
}

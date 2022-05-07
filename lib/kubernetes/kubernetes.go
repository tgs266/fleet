package kubernetes

import (
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/prometheus"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	metrics "k8s.io/metrics/pkg/client/clientset/versioned"
)

type K8Client struct {
	InCluster       bool
	K8              kubernetes.Interface
	Metrics         *metrics.Clientset
	Prometheus      *prometheus.PrometheusManager
	Config          *rest.Config
	ConnectionError error
}

func (K8 *K8Client) Connect(config *rest.Config, inCluster bool) error {

	if config == nil {
		return errors.NewConfigInitializationError(nil)
	}
	clientset, err := kubernetes.NewForConfig(config)
	if err != nil {
		return err
	}
	K8.K8 = clientset
	K8.InCluster = inCluster
	K8.Config = config
	K8.connectMetrics(config)
	K8.connectPrometheus()
	return nil
}

func (K8 *K8Client) connectMetrics(cfg *rest.Config) {
	clientset, _ := metrics.NewForConfig(cfg)
	K8.Metrics = clientset
}

func (K8 *K8Client) connectPrometheus() {
	K8.Prometheus = prometheus.New(K8.K8.CoreV1().RESTClient())
}

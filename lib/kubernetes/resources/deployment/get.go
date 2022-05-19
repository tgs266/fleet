package deployment

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	v1 "k8s.io/api/apps/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

func getInternal(K8 *kubernetes.K8Client, namespace string, name string, options metaV1.GetOptions) (*v1.Deployment, error) {
	return K8.K8.AppsV1().Deployments(namespace).Get(context.TODO(), name, options)
}

func Get(K8 *kubernetes.K8Client, namespace string, name string) (*Deployment, error) {
	dep, err := getInternal(K8, namespace, name, metaV1.GetOptions{})
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}
	selector, err := metaV1.LabelSelectorAsSelector(dep.Spec.Selector)
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}
	options := metaV1.ListOptions{LabelSelector: selector.String()}
	podChannel := channels.GetPodListChannel(K8.K8, namespace, options, 1)
	metricsChannel := channels.GetPodMetricsChannel(K8.Metrics, namespace, options, 1)
	servicesChannel := channels.GetServiceListChannel(K8.K8, namespace, options, 1)

	pods := <-podChannel.List
	err = <-podChannel.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	svcs := <-servicesChannel.List
	err = <-servicesChannel.Error
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}
	// we dont care about metrics error because that shouldnt kill the app
	mets := <-metricsChannel.List

	return BuildDeployment(K8, dep, svcs, pods, mets), nil
}

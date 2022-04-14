package service

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/channels"
	v1 "k8s.io/api/core/v1"
	metaV1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/fields"
	"k8s.io/apimachinery/pkg/labels"
)

func getInternal(K8 *kubernetes.K8Client, namespace string, name string, options metaV1.GetOptions) (*v1.Service, error) {
	return K8.K8.CoreV1().Services(namespace).Get(context.TODO(), name, options)
}

func Get(K8 *kubernetes.K8Client, namespace string, name string) (*Service, error) {
	service, err := getInternal(K8, namespace, name, metaV1.GetOptions{})
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}
	selector := labels.SelectorFromSet(service.Spec.Selector)
	options := metaV1.ListOptions{LabelSelector: selector.String()}
	endpointFieldSelector, err := fields.ParseSelector("metadata.name" + "=" + name)
	if err != nil {
		return nil, errors.ParseInternalError(err)
	}

	podChannel := channels.GetPodListChannel(K8.K8, namespace, options, 1)
	endPointChannel := channels.GetEndpointList(K8.K8, namespace, metaV1.ListOptions{
		LabelSelector: selector.String(),
		FieldSelector: endpointFieldSelector.String(),
	}, 1)

	// ignore error here
	pods := <-podChannel.List
	endpoints := <-endPointChannel.List
	return BuildService(service, pods, endpoints), nil
}

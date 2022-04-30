package raw

import (
	"context"

	"github.com/tgs266/fleet/lib/errors"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/client-go/rest"
)

type Raw map[string]interface{}

type ClientType string

// List of client types supported by the UI.
const (
	CoreClientType = "coreclient"
	AppsClientType = "appsclient"
)

type RawMapping struct {
	Resource     string
	ClientType   ClientType
	UseNamespace bool
}

var PluralKindToRawMapping = map[string]RawMapping{
	"deployments":     {"deployments", AppsClientType, true},
	"pods":            {"pods", CoreClientType, true},
	"services":        {"services", CoreClientType, true},
	"namespaces":      {"namespaces", CoreClientType, true},
	"serviceaccounts": {"serviceaccounts", CoreClientType, true},
	"secrets":         {"secrets", CoreClientType, true},
}

type Client struct {
	coreClient rest.Interface
	appsClient rest.Interface
}

func BuildClient(coreClient, appsClient rest.Interface) *Client {
	return &Client{
		coreClient: coreClient,
		appsClient: appsClient,
	}
}

func (c *Client) getClient(clientType ClientType) (rest.Interface, bool) {
	switch clientType {
	case AppsClientType:
		return c.appsClient, c.appsClient != nil
	default:
		return c.coreClient, c.coreClient != nil
	}
}

func (c *Client) Get(kind string, name string, namespace string) (runtime.Object, error) {
	mapping, ok := PluralKindToRawMapping[kind]
	if !ok {
		return nil, errors.NewBadRequestInvalidResourceType(kind)
	}

	clientType := mapping.ClientType
	resource := mapping.Resource
	useNamespace := mapping.UseNamespace

	if useNamespace && namespace == "" {
		return nil, errors.NewBadRequestMustProvideNamespace()
	}

	client, ok := c.getClient(clientType)
	if !ok {
		return nil, errors.CreateError(500, "unknown error occured")
	}
	req := client.Get().Resource(resource).Name(name).SetHeader("Accept", "application/json")
	result := &runtime.Unknown{}

	if useNamespace {
		req.Namespace(namespace)
	}
	err := req.Do(context.TODO()).Into(result)
	return result, err
}

func (c *Client) Put(kind string, name string, namespace string, object *runtime.Unknown) error {
	mapping, ok := PluralKindToRawMapping[kind]
	if !ok {
		return errors.NewBadRequestInvalidResourceType(kind)
	}

	clientType := mapping.ClientType
	resource := mapping.Resource
	useNamespace := mapping.UseNamespace

	if useNamespace && namespace == "" {
		return errors.NewBadRequestMustProvideNamespace()
	}

	client, ok := c.getClient(clientType)
	if !ok {
		return errors.CreateError(500, "unknown error occured")
	}
	req := client.Put().Resource(resource).Name(name).SetHeader("Content-Type", "application/json").Body([]byte(object.Raw))

	if useNamespace {
		req.Namespace(namespace)
	}
	return req.Do(context.TODO()).Error()
}

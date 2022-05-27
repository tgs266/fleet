package controllers

import (
	"bufio"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/tgs266/fleet/lib/api"
	"github.com/tgs266/fleet/lib/client"
	"github.com/tgs266/fleet/lib/errors"
	"github.com/tgs266/fleet/lib/kubernetes"
	"github.com/tgs266/fleet/lib/kubernetes/resources/clusterrole"
	"github.com/tgs266/fleet/lib/kubernetes/resources/clusterrolebinding"
	"github.com/tgs266/fleet/lib/kubernetes/resources/deployment"
	"github.com/tgs266/fleet/lib/kubernetes/resources/namespace"
	"github.com/tgs266/fleet/lib/kubernetes/resources/pod"
	"github.com/tgs266/fleet/lib/kubernetes/resources/replicaset"
	"github.com/tgs266/fleet/lib/kubernetes/resources/role"
	"github.com/tgs266/fleet/lib/kubernetes/resources/rolebinding"
	"github.com/tgs266/fleet/lib/kubernetes/resources/secret"
	"github.com/tgs266/fleet/lib/kubernetes/resources/service"
	"github.com/tgs266/fleet/lib/kubernetes/resources/serviceaccount"
	"github.com/tgs266/fleet/lib/shared"
	"github.com/valyala/fasthttp"
)

func sendSSEError(err error, w *bufio.Writer) {
	bytes, _ := json.Marshal(err)
	fmt.Fprintf(w, "data: error: %s\n\n", string(bytes))
	w.Flush()
}

type SSEInfo struct {
	K8        *kubernetes.K8Client
	interval  int
	name      string
	namespace string
}

func GetSSEDetails(c *fiber.Ctx, client *client.ClientManager) (*SSEInfo, error) {
	c.Set("Cache-Control", "no-cache")
	c.Set("Connection", "keep-alive")
	c.Set("Transfer-Encoding", "chunked")
	c.Set("Content-Type", "text/event-stream")

	K8, err := client.Client(c)
	if err != nil {
		return nil, err
	}

	interval, err := strconv.Atoi(c.Query("interval", "5000"))
	if err != nil {
		return nil, err
	}

	name := c.Params("name")
	namespace := c.Params("namespace")

	return &SSEInfo{
		K8:        K8,
		name:      name,
		namespace: namespace,
		interval:  interval,
	}, nil
}

func SendSSEResponse(data interface{}, sseDetails *SSEInfo, w *bufio.Writer) error {
	bytes, err := json.Marshal(data)
	if err != nil {
		sendSSEError(err, w)
		return err
	}

	fmt.Fprintf(w, "data: %s\n\n", string(bytes))

	w.Flush()

	time.Sleep(time.Duration(sseDetails.interval) * time.Millisecond)
	return nil
}

func NamespacedResourceGetterSSE[T any](f func(K8 *kubernetes.K8Client, namespace string, name string) (T, error)) func(c *fiber.Ctx, client *client.ClientManager) error {
	return func(c *fiber.Ctx, client *client.ClientManager) error {
		sseDetails, err := GetSSEDetails(c, client)
		if err != nil {
			return err
		}
		c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
			for {
				data, err := f(sseDetails.K8, sseDetails.namespace, sseDetails.name)
				if err != nil {
					sendSSEError(err, w)
					continue
				}

				if err := SendSSEResponse(data, sseDetails, w); err != nil {
					continue
				}

			}
		}))
		return nil
	}
}

func NonNamespacedResourceGetterSSE[T any](f func(K8 *kubernetes.K8Client, name string) (T, error)) func(c *fiber.Ctx, client *client.ClientManager) error {
	return func(c *fiber.Ctx, client *client.ClientManager) error {
		sseDetails, err := GetSSEDetails(c, client)
		if err != nil {
			return err
		}

		c.Context().SetBodyStreamWriter(fasthttp.StreamWriter(func(w *bufio.Writer) {
			for {
				data, err := f(sseDetails.K8, sseDetails.name)
				if err != nil {
					sendSSEError(err, w)
					continue
				}

				if err := SendSSEResponse(data, sseDetails, w); err != nil {
					continue
				}
			}
		}))
		return nil
	}
}

func NamespacedResourceGetter[T any](f func(K8 *kubernetes.K8Client, namespace, name string) (T, error)) func(c *fiber.Ctx, client *client.ClientManager) error {
	return func(c *fiber.Ctx, client *client.ClientManager) error {
		K8, err := client.Client(c)
		if err != nil {
			return err
		}

		namespace := shared.GetNamespace(c.Params("namespace"))
		name := c.Params("name")

		sa, err := f(K8, namespace, name)
		if err != nil {
			return errors.ParseInternalError(err)
		}
		return c.Status(fiber.StatusOK).JSON(sa)
	}
}

func NonNamespacedResourceGetter[T any](f func(K8 *kubernetes.K8Client, name string) (T, error)) func(c *fiber.Ctx, client *client.ClientManager) error {
	return func(c *fiber.Ctx, client *client.ClientManager) error {
		K8, err := client.Client(c)
		if err != nil {
			return err
		}

		name := c.Params("name")

		sa, err := f(K8, name)
		if err != nil {
			return errors.ParseInternalError(err)
		}
		return c.Status(fiber.StatusOK).JSON(sa)
	}
}

func initializePodRoutes(app *api.API) {
	app.Get("/api/v1/pods/:namespace", GetPodMetaList)
	app.Get("/api/v1/pods/:namespace/:name", NamespacedResourceGetter(pod.Get))
	app.Delete("/api/v1/pods/:namespace/:name", DeletePod)
	app.Get("/api/v1/pods/:namespace/:podName/containers/:containerName", GetPodContainer)
	app.WebsocketGet("/ws/v1/pods/:namespace/:podName/containers/:containerName/logs", ContainerLogStream)
	app.WebsocketGet("/ws/v1/pods/:namespace/:name/events", PodEventStream)
	app.WebsocketGet("/ws/v1/pods/:namespace/:name/containers/:containerName/exec", PodExec)

	app.Get("/sse/v1/pods/:namespace/:name", NamespacedResourceGetterSSE(pod.Get))

}

func initializeDeploymentRoutes(app *api.API) {
	app.Post("/api/v1/deployments/", CreateDeployment)
	app.Get("/api/v1/deployments/:namespace", GetDeploymentStubList)
	app.Get("/api/v1/deployments/:namespace/:name", NamespacedResourceGetter(deployment.Get))
	app.Delete("/api/v1/deployments/:namespace/:name", DeleteDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/scale", ScaleDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/restart", RestartDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/container-specs/:specName", UpdateDeploymentContainerSpec)
	app.WebsocketGet("/ws/v1/deployments/:namespace/:name/events", DeploymentEventStream)

	app.Get("/sse/v1/deployments/:namespace/:name", NamespacedResourceGetterSSE(deployment.Get))

}

func initializeNodeRoutes(app *api.API) {
	app.Get("/api/v1/nodes", GetNodes)
	app.Get("/api/v1/nodes/:name", GetNode)
}

func initializeServiceRoutes(app *api.API) {
	app.Get("/api/v1/services/:namespace/", GetServices)
	app.Get("/api/v1/services/:namespace/:name", NamespacedResourceGetter(service.Get))
	app.Get("/sse/v1/services/:namespace/:name", NamespacedResourceGetterSSE(service.Get))

}

func initializeServiceAccountRoutes(app *api.API) {
	app.Get("/api/v1/serviceaccounts/:namespace/", GetServiceAccounts)
	app.Get("/api/v1/serviceaccounts/:namespace/:name", NamespacedResourceGetter(serviceaccount.Get))
	app.Get("/sse/v1/serviceaccounts/:namespace/:name", NamespacedResourceGetterSSE(serviceaccount.Get))
	app.Put("/api/v1/serviceaccounts/:namespace/:name/bind/role", ConnectToRoleBinding)
	app.Put("/api/v1/serviceaccounts/:namespace/:name/bind/clusterrole", ConnectToClusterRoleBinding)
	app.Put("/api/v1/serviceaccounts/:namespace/:name/remove/role", DisconnectRoleBinding)
	app.Put("/api/v1/serviceaccounts/:namespace/:name/remove/clusterrole", DisconnectClusterRoleBinding)
}

func initializeRoleRoutes(app *api.API) {
	app.Get("/api/v1/roles/:namespace/", GetRoles)
	app.Get("/api/v1/roles/:namespace/:name", NamespacedResourceGetter(role.Get))
	app.Get("/sse/v1/roles/:namespace/:name", NamespacedResourceGetterSSE(role.Get))

	app.Get("/api/v1/clusterroles/", GetClusterRoles)
	app.Get("/api/v1/clusterroles/:name", NonNamespacedResourceGetter(clusterrole.Get))
	app.Get("/sse/v1/clusterroles/:name", NonNamespacedResourceGetterSSE(clusterrole.Get))
}

func initializeRoleBindingRoutes(app *api.API) {
	app.Get("/api/v1/rolebindings/:namespace/", GetRoleBindings)
	app.Get("/api/v1/rolebindings/:namespace/:name", NamespacedResourceGetter(rolebinding.Get))
	app.Get("/sse/v1/rolebindings/:namespace/:name", NamespacedResourceGetterSSE(rolebinding.Get))

	app.Get("/api/v1/clusterrolebindings/", GetClusterRoleBindings)
	app.Get("/api/v1/clusterrolebindings/:name", NonNamespacedResourceGetter(clusterrolebinding.Get))
	app.Get("/sse/v1/clusterrolebindings/:name", NonNamespacedResourceGetterSSE(clusterrolebinding.Get))
}

func initializePromRoutes(app *api.API) {
	app.Get("/api/v1/metrics/query", PrometheusQuery)
	app.Post("/api/v1/metrics/query", PrometheusQuery)
	app.Get("/api/v1/metrics/query/range", PrometheusQueryRange)
	app.Post("/api/v1/metrics/query/range", PrometheusQueryRange)
	app.Get("/api/v1/metrics/alerts", PrometheusAlert)
}

func initializeSecretRoutes(app *api.API) {
	app.Get("/api/v1/secrets/:namespace/", GetSecrets)
	app.Get("/api/v1/secrets/:namespace/:name", NamespacedResourceGetter(secret.Get))
	app.Get("/sse/v1/secrets/:namespace/:name", NamespacedResourceGetterSSE(secret.Get))
}

func initializeReplicaSetRoutes(app *api.API) {
	app.Get("/api/v1/replicasets/:namespace/", GetReplicaSets)
	app.Get("/api/v1/replicasets/:namespace/:name", NamespacedResourceGetter(replicaset.Get))
	app.Get("/sse/v1/replicasets/:namespace/:name", NamespacedResourceGetterSSE(replicaset.Get))
	app.Put("/api/v1/replicasets/:namespace/:name/restart", RestartReplicaSet)
	app.WebsocketGet("/ws/v1/replicasets/:namespace/:name/events", ReplicaSetEventStream)
}

func initializeHelmRoutes(app *api.API) {
	app.Get("/api/v1/helm/charts", HelmSearch)
	app.Get("/api/v1/helm/charts/:repo/:name", HelmGet)
	app.Post("/api/v1/helm/charts/install", HelmInstall)

	app.Get("/api/v1/helm/releases/", HelmSearchReleases)
	app.Get("/api/v1/helm/releases/:name", HelmGetRelease)
}

func initializeOtherRoutes(app *api.API) {
	app.Get("/api/v1/auth/", UsingAuth)
	app.Get("/api/v1/auth/cani", CanI)
	app.Get("/api/v1/auth/whoami", WhoAmI)
	app.Post("/api/v1/auth/login", Login)
	app.Post("/api/v1/auth/refresh", Refresh)
	app.Get("/api/v1/images", GetAllImages)

	app.Get("/api/v1/system/resources", GetSystemResources)

	app.Get("/api/v1/namespaces/", GetNamespaces)
	app.Get("/api/v1/namespaces/:name", NonNamespacedResourceGetter(namespace.Get))
	app.Get("/sse/v1/namespaces/:name", NonNamespacedResourceGetterSSE(namespace.Get))

	rawBase := "/api/v1/raw/:kind"

	app.Get(rawBase+"/:namespace/:name", RawGet)
	app.Get(rawBase+"/:name", RawGet)

	app.Put(rawBase+"/:namespace/:name", RawPut)
	app.Put(rawBase+"/:name", RawPut)

	app.Delete(rawBase+"/:namespace/:name", RawDelete)
	app.Delete(rawBase+"/:name", RawDelete)

	app.Get("/api/v1/filters/properties", GetFilters)
}

func InitializeRoutes(app *api.API) {
	initializePodRoutes(app)
	initializeDeploymentRoutes(app)
	initializeNodeRoutes(app)
	initializeServiceRoutes(app)
	initializeServiceAccountRoutes(app)
	initializeRoleRoutes(app)
	initializeRoleBindingRoutes(app)
	initializeSecretRoutes(app)
	initializeReplicaSetRoutes(app)
	initializeOtherRoutes(app)
	initializePromRoutes(app)
	initializeHelmRoutes(app)
}

package controllers

import "github.com/tgs266/fleet/lib/api"

func initializePodRoutes(app *api.API) {
	app.Get("/api/v1/pods/:namespace", GetPodMetaList)
	app.Get("/api/v1/pods/:namespace/:name", GetPod)
	app.Delete("/api/v1/pods/:namespace/:name", DeletePod)
	app.Get("/api/v1/pods/:namespace/:podName/containers/:containerName", GetPodContainer)
	app.WebsocketGet("/ws/v1/pods/:namespace/:podName/containers/:containerName/logs", ContainerLogStream)
	app.WebsocketGet("/ws/v1/pods/:namespace/:name/events", PodEventStream)
}

func initializeDeploymentRoutes(app *api.API) {
	app.Post("/api/v1/deployments/", CreateDeployment)
	app.Get("/api/v1/deployments/:namespace", GetDeploymentStubList)
	app.Get("/api/v1/deployments/:namespace/:name", GetDeployment)
	app.Delete("/api/v1/deployments/:namespace/:name", DeleteDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/scale", ScaleDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/restart", RestartDeployment)
	app.Put("/api/v1/deployments/:namespace/:name/container-specs/:specName", UpdateDeploymentContainerSpec)
	app.WebsocketGet("/ws/v1/deployments/:namespace/:name/events", DeploymentEventStream)
}

func initializeNodeRoutes(app *api.API) {
	app.Get("/api/v1/nodes", GetNodes)
	app.Get("/api/v1/nodes/:name", GetNode)
}

func initializeServiceRoutes(app *api.API) {
	app.Get("/api/v1/services/:namespace/", GetServices)
	app.Get("/api/v1/services/:namespace/:name", GetService)
}

func initializeServiceAccountRoutes(app *api.API) {
	app.Get("/api/v1/serviceaccounts/:namespace/", GetServiceAccounts)
	app.Get("/api/v1/serviceaccounts/:namespace/:name", GetServiceAccount)
	app.Put("/api/v1/serviceaccounts/:namespace/:name/bind/role", ConnectToRoleBinding)
	app.Put("/api/v1/serviceaccounts/:namespace/:name/bind/clusterrole", ConnectToClusterRoleBinding)
}

func initializeRoleRoutes(app *api.API) {
	app.Get("/api/v1/roles/:namespace/", GetRoles)
	app.Get("/api/v1/roles/:namespace/:name", GetRole)

	app.Get("/api/v1/clusterroles/", GetClusterRoles)
	app.Get("/api/v1/clusterroles/:name", GetClusterRole)
}

func initializeRoleBindingRoutes(app *api.API) {
	app.Get("/api/v1/rolebindings/:namespace/", GetRoleBindings)
	app.Get("/api/v1/rolebindings/:namespace/:name", GetRoleBinding)

	app.Get("/api/v1/clusterrolebindings/", GetClusterRoleBindings)
	app.Get("/api/v1/clusterrolebindings/:name", GetClusterRoleBinding)
}

func initializeSecretRoutes(app *api.API) {
	app.Get("/api/v1/secrets/:namespace/", GetSecrets)
	app.Get("/api/v1/secrets/:namespace/:name", GetSecret)
}

func initializeOtherRoutes(app *api.API) {
	app.Get("/api/v1/auth/", UsingAuth)
	app.Get("/api/v1/auth/cani", CanI)
	app.Post("/api/v1/auth/login", Login)
	app.Post("/api/v1/auth/refresh", Refresh)
	app.Get("/api/v1/images", GetAllImages)

	app.Get("/api/v1/system/resources", GetSystemResources)

	app.Get("/api/v1/namespaces/", GetNamespaces)
	app.Get("/api/v1/namespaces/:name", GetNamespace)

	app.Get("/api/v1/raw/:kind/:namespace/:name", RawGet)
	app.Get("/api/v1/raw/:kind/:name", RawGet)

	app.Put("/api/v1/raw/:kind/:namespace/:name", RawPut)
	app.Put("/api/v1/raw/:kind/:name", RawPut)

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
	initializeOtherRoutes(app)
}

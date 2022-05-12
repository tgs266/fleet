
# Fleet

Fleet is a Kubernetes fleet management tool built for any workload size, from single node deployments to massive multi-node deployments.

## Features

- Easy to use management of kubernetes resources
  - Deployments
  - Pods
  - Services
  - etc.
- Fleet view ([screenshot](figures/fleet-view.png))

## Roadmap

- Graphical deployment creator
- User authentication
- User settings store
- And more 

## Run Fleet

There are two supported ways to run fleet (outside of in development). These methods depend on if the cluster is [local]() or [remote]()

### Local Cluster

All you have to do is apply the fleet kubernetes configuration
```
kubectl apply -f https://raw.githubusercontent.com/tgs266/fleet/main/deploy/aio.yaml
```

Then just fire up a proxy

```
kubectl proxy
```
And then go to <http://localhost:8001/api/v1/namespaces/fleet/services/fleet/proxy/#/>

Or port forward the pod
```
kubectl port-forward POD 9095:9095 -n fleet
```
And go to <http://localhost:9095/#/>

### Remote cluster

We are going to install fleet the same way
```
kubectl apply -f https://raw.githubusercontent.com/tgs266/fleet/main/deploy/aio.yaml
```

Then, install the Electron app for fleet (TODO: provide link), run the app and configure your connection to the cluster

<!-- Testing: go test ./... -covermode=count -coverprofile=coverage.out -coverpkg=./..., go tool cover -html=coverage.out -->

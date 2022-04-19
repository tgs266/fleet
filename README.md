
# Fleet

Fleet is a Kubernetes fleet management tool built for any workload size, from single node deployments to massive multi-node deployments.

## Features

- Easy to use kubernetes management of resources
  - Deployments
  - Pods
  - Services
  - etc.
- Fleet view ([screenshot](figures/fleet-view.png))

## Roadmap

- Graphical deployment creator
- User authentication
- User settings store

View more of what is being worked on [here](https://app.clickup.com/36714921/v/l/5-102851183-1?pr=54807993)

## Issues

You can report issues here on github or in the clickup [issue tracker](https://app.clickup.com/36714921/v/l/6-174722300-1)

## Install and Run Fleet

### In Kubernetes

All you have to do is apply the fleet kubernetes configuration
```
kubectl apply -f https://raw.githubusercontent.com/tgs266/fleet/main/deploy/aio.yaml
```

Then just fire up a proxy

```
kubectl proxy
```

And then go to <http://localhost:8001/api/v1/namespaces/fleet/services/fleet/proxy/#/>

### From source

Running from source requires you to have a config file in `$HOME/.kube/config`

Clone the project

```bash
  git clone https://github.com/tgs266/fleet
```

Go to the project directory

```bash
  cd fleet
```

Install dependencies

```bash
  yarn install
```

Start webpack watch

```bash
  yarn start
```

Start the server

```bash
  cd lib && go run main.go --src=../build
```

Then navigate to <http://localhost:9095>

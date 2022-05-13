#!/bin/bash

kubectl create namespace fleet
kubectl create namespace fleet-metrics

mkdir fleet-temp

curl -L https://api.github.com/repos/tgs266/fleet/tarball | tar xzv -C fleet-temp --strip-components 1

cd fleet-temp/
cd deploy
kubectl apply -f aio.yaml
kubectl apply -f prometheus/
kubectl apply -f node-exporter/
kubectl apply -f kube-state-metrics/
cd ../..
rm -rf fleet-temp

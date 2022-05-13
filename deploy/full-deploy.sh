#!/bin/bash

kubectl create namespace fleet
kubectl create namespace fleet-metrics

curl -L https://api.github.com/repos/tgs266/fleet/tarball -o fleet.tgz
tar xzvf fleet.tgz 
cd fleet 
cd deploy 
kubectl apply -f aio.yaml
kubectl apply -f prometheus/
kubectl apply -f node-exporter/
kubectl apply -f kube-state-metrics/
cd ../..
rm -rf fleet fleet.tgz
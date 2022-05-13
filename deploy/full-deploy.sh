#!/bin/bash

kubectl create namespace fleet
kubectl create namespace fleet-metrics

mkdir fleet-temp 
cd fleet-temp 

curl -L https://api.github.com/repos/tgs266/fleet/tarball -o fleet.tgz
tar xzvf fleet.tgz -C fleet --strip-components 1
cd fleet 
cd deploy 
kubectl apply -f aio.yaml
kubectl apply -f prometheus/
kubectl apply -f node-exporter/
kubectl apply -f kube-state-metrics/
cd ../../..
rm -rf fleet-temp
/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const express = require('express');
const fs = require('fs');
const path = require('path');
const net = require('net');
const YAML = require('yaml');
const homedir = require('os').homedir();
const bodyParser = require('body-parser');
const k8s = require('@kubernetes/client-node');
const { default: axios } = require('axios');
const { ClusterManager } = require('./clustermanager');

const app = express();

const clusters = new ClusterManager();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/api/v1/electron/clusters', (req, res) => {
    try {
        const rawYaml = fs.readFileSync(path.join(homedir, '.kube', 'config'));
        const kubeconfig = new k8s.KubeConfig();
        kubeconfig.loadFromString(rawYaml.toString());
        for (const context of kubeconfig.contexts) {
            const cl = {
                name: context.name,
                isConnected: false,
                source: path.join(homedir, '.kube', 'config'),
                port: null,
                server: null,
            };
            clusters.addIfNotPresent(cl);
        }
        res.status(200).json(clusters.clusters);
    } catch {
        res.status(404).json({
            status: 'NO_FILE_FOUND',
            code: 404,
            message: 'could not find kubernetes config file',
        });
    }
});

app.get('/api/v1/electron/current', (req, res) => {
    if (clusters.current) {
        res.status(200).json(clusters.current);
    } else {
        res.status(500).json({
            status: 'NO_CLUSTER_SELECTED',
            code: 500,
            message: 'no cluster selected',
        });
    }
});

app.post('/api/v1/electron/start', (req, res) => {
    let kubeconfig = null;
    try {
        const rawYaml = fs.readFileSync(path.join(homedir, '.kube', 'config'));
        kubeconfig = new k8s.KubeConfig();
        kubeconfig.loadFromString(rawYaml.toString());
    } catch {
        res.status(404).json({
            status: 'NO_FILE_FOUND',
            code: 404,
            message: 'could not find kubernetes config file',
        });
        return;
    }
    const context = req.body;
    const result = clusters.setCurrent(context.name, app);
    if (result) {
        kubeconfig.setCurrentContext(context.name);
        res.status(200).json({});
        return;
    }
    res.status(404).json({
        status: 'NO_CLUSTER_FOUND',
        code: 404,
        message: 'could not find cluster',
    });
});

app.post('/api/v1/electron/stop', (req, res) => {
    clusters.setCurrent(null, app);
    res.status(200).json({});
});

app.post('/api/v1/electron/connect', (req, res) => {
    let kubeconfig = null;
    try {
        const rawYaml = fs.readFileSync(path.join(homedir, '.kube', 'config'));
        kubeconfig = new k8s.KubeConfig();
        kubeconfig.loadFromString(rawYaml.toString());
    } catch {
        res.status(404).json({
            status: 'NO_FILE_FOUND',
            code: 404,
            message: 'could not find kubernetes config file',
        });
        return;
    }

    const context = req.body;
    kubeconfig.setCurrentContext(context.name);

    const k8sApi = kubeconfig.makeApiClient(k8s.CoreV1Api);

    k8sApi
        .listNamespacedPod('fleet')
        .then((r) => {
            for (const pod of r.body.items) {
                if (pod.metadata.name.includes('fleet')) {
                    const forward = new k8s.PortForward(kubeconfig);
                    const server = net.createServer((socket) => {
                        forward.portForward(
                            'fleet',
                            pod.metadata.name,
                            [9095],
                            socket,
                            null,
                            socket
                        );
                    });
                    server.listen(0);
                    clusters.updateOrAdd({
                        name: context.name,
                        isConnected: true,
                        port: server.address().port,
                        server,
                    });
                    clusters.setCurrent(context.name, app);
                    axios
                        .post(`http://127.0.0.1:${server.address().port}/api/v1/auth/login`, {
                            configFile: YAML.stringify(JSON.parse(kubeconfig.exportConfig())),
                        })
                        .then((r2) => {
                            res.json({
                                token: r2.data.token,
                                cluster: clusters.getCluster(context.name),
                            });
                        })
                        .catch((r3) => {
                            res.json(r3);
                        });
                    return;
                }
            }
            res.status(404).json({
                status: 'NO_FLEET_DEP_FOUND',
                code: 404,
                message: 'could not find fleet deployment on cluster',
            });
        })
        .catch(() => {
            res.status(404).json({
                status: 'NO_FLEET_DEP_FOUND',
                code: 404,
                message: 'could not find fleet deployment on cluster',
            });
        });
});

app.post('/api/v1/electron/disconnect', (req, res) => {
    try {
        const { name } = req.body;

        const cluster = clusters.getCluster(name);
        cluster.isConnected = false;
        cluster.server.close();
        cluster.server = null;
        cluster.port = '';
        clusters.updateOrAdd(cluster);
        if (clusters.current.name === cluster.name) {
            clusters.current = null;
        }

        res.status(200).json({});
    } catch {
        res.status(500).json({
            status: 'DISCONNECT_FAILURE',
            code: 500,
            message: 'could not disconnect',
        });
    }
});

app.listen(9095);

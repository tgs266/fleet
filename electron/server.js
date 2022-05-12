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

const app = express();

let server = null;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/api/v1/electron/detect', (req, res) => {
    try {
        const rawYaml = fs.readFileSync(path.join(homedir, '.kube', 'config'));
        const kubeconfig = new k8s.KubeConfig();
        kubeconfig.loadFromString(rawYaml.toString());
        res.status(200).json(kubeconfig.contexts);
    } catch {
        res.status(404).json({
            status: 'NO_FILE_FOUND',
            code: 404,
            message: 'could not find kubernetes config file',
        });
    }
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
                    if (server) {
                        server.close();
                    }
                    server = net.createServer((socket) => {
                        forward.portForward(
                            'fleet',
                            pod.metadata.name,
                            [9095],
                            socket,
                            null,
                            socket
                        );
                    });
                    server.listen(9095, '127.0.0.1');
                    axios
                        .post('http://127.0.0.1:9095/api/v1/auth/login', {
                            configFile: YAML.stringify(JSON.parse(kubeconfig.exportConfig())),
                        })
                        .then((r2) => {
                            res.json(r2.data);
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

app.listen(9096);

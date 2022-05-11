const express = require('express');
const fs = require('fs');
const path = require('path');
const homedir = require('os').homedir();
const k8s = require('@kubernetes/client-node');

const app = express();

app.get('/api/v1/electron/detect', (req, res) => {
    try {
        const rawYaml = fs.readFileSync(path.join(homedir, '.kube', 'config'));
        const kubeconfig = new k8s.KubeConfig();
        kubeconfig.loadFromString(rawYaml.toString());
        res.status(200).json(kubeconfig.clusters);
    } catch {
        res.status(404).json({
            status: 'NO_FILE_FOUND',
            code: 404,
            message: 'could not find kubernetes config file',
        });
    }
});

app.listen(9096);

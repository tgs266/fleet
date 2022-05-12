/* eslint-disable no-restricted-syntax */
const { createProxyMiddleware } = require('http-proxy-middleware');

class ClusterManager {
    clusters = [];

    current = null;

    setCurrent(name, app) {
        const cluster = this.getCluster(name);
        const apiProxy = createProxyMiddleware('/proxy', {
            target: `http://localhost:${cluster.server.address().port}`,
        });
        this.current = cluster;
        app.use(apiProxy);
    }

    getCluster(name) {
        for (const c of this.clusters) {
            if (c.name === name) {
                return c;
            }
        }
        return null;
    }

    addIfNotPresent(cluster) {
        for (const c of this.clusters) {
            if (c.name === cluster.name) {
                return;
            }
        }
        this.clusters.push(cluster);
    }

    updateOrAdd(cluster) {
        let i = 0;
        for (const c of this.clusters) {
            if (c.name === cluster.name) {
                this.clusters[i] = {
                    ...this.clusters[i],
                    ...cluster,
                };
                return;
            }
            i += 1;
        }
        this.clusters.push(cluster);
    }
}

module.exports = {
    ClusterManager,
};

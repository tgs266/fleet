/* eslint-disable no-restricted-syntax */
class ClusterManager {
    clusters = [];

    current = null;

    setCurrent(name) {
        if (!name) {
            this.current = null;
            return true;
        }
        const cluster = this.getCluster(name);
        if (!cluster) {
            return false;
        }
        this.current = cluster;
        return true;
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

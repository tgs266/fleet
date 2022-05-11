/* eslint-disable no-restricted-syntax */
import { Card } from '@blueprintjs/core';
import * as React from 'react';
import RangeQueryLineChart from '../../components/MetricCharts/RangeQueryLineChart';
import { useNavContext } from '../../layouts/Navigation';
import K8 from '../../services/k8.service';
import Prometheus from '../../services/prometheus.service';
import ResourceCard from './ResourceCard';

export default function Home() {
    const [, setState] = useNavContext();

    const [metrics, setMetrics] = React.useState(null);
    const [interval, setInterval] = React.useState(null);
    const [masterNodeName, setMasterNodeName] = React.useState(null);
    const [nodeNames, setNodeNames] = React.useState([]);

    React.useEffect(() => {
        setState({
            breadcrumbs: [
                {
                    text: 'Home',
                },
            ],
            menu: null,
            buttons: [],
        });
    }, []);

    React.useEffect(() => {
        let nn = '';
        K8.nodes.getNodes().then((resp) => {
            for (const n of resp.data) {
                for (const l of Object.keys(n.labels)) {
                    if (l.includes('role') && l.includes('master')) {
                        nn = n.name;
                        break;
                    }
                }
            }
            const x = resp.data.map((n) => n.name);
            setNodeNames(x);
            if (nn === '') {
                setMasterNodeName(resp.data[0].name);
            } else {
                setMasterNodeName(nn);
            }
        });
    }, []);

    React.useEffect(() => {
        const joinedNames = nodeNames.join('|');
        if (masterNodeName) {
            Prometheus.pollQueryRange(
                {
                    cpuUsage: Prometheus.buildQuery('cpuUsage', {
                        resource: 'cluster',
                        name: masterNodeName,
                    }),
                    memoryUsage: Prometheus.buildQuery('memoryUsage', {
                        resource: 'cluster',
                        name: masterNodeName,
                    }),
                    cpuCapacity: Prometheus.buildQuery('cpuCapacity', {
                        resource: 'cluster',
                        name: masterNodeName,
                    }),
                    memoryCapacity: Prometheus.buildQuery('memoryCapacity', {
                        resource: 'cluster',
                        name: masterNodeName,
                    }),
                    podUsage: Prometheus.buildQuery('podUsage', {
                        resource: 'cluster',
                        name: joinedNames,
                    }),
                    podCapacity: Prometheus.buildQuery('podCapacity', {
                        resource: 'cluster',
                        name: joinedNames,
                    }),
                },
                (resp) => {
                    setMetrics(resp.data);
                },
                (t) => setInterval(t)
            );
            return function cleanup() {
                clearInterval(interval);
            };
        }
        return null;
    }, [masterNodeName]);

    React.useEffect(() => {
        K8.cluster.getCurrentClusterName().then((r) => {
            setState({
                breadcrumbs: [
                    {
                        text: `Home`,
                    },
                ],
                menu: null,
                buttons: [<div>Cluster: {r.data}</div>],
            });
        });
    }, []);

    if (!metrics) {
        return null;
    }

    return (
        <div style={{ margin: '1em' }}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '1em',
                }}
            >
                <Card style={{ width: 'calc(50% - 0.5em)', marginRight: '0.5em' }}>
                    <RangeQueryLineChart
                        data={{
                            cpuUsage: metrics.cpuUsage,
                        }}
                        height={150}
                        labels={{ cpuUsage: 'kubernetes_node' }}
                        title="CPU Core Usage"
                    />
                </Card>
                <Card style={{ width: 'calc(50% - 0.5em)', marginLeft: '0.5em' }}>
                    <RangeQueryLineChart
                        data={{
                            memoryUsage: metrics.memoryUsage,
                        }}
                        labels={{ memoryUsage: 'kubernetes_node' }}
                        height={150}
                        title="Memory Usage"
                        bytes
                    />
                </Card>
            </div>
            <ResourceCard
                metrics={{
                    cpuUsage: metrics.cpuUsage,
                    cpuCapacity: metrics.cpuCapacity,
                    memoryUsage: metrics.memoryUsage,
                    memoryCapacity: metrics.memoryCapacity,
                    podUsage: metrics.podUsage,
                    podCapacity: metrics.podCapacity,
                }}
            />
        </div>
    );
}

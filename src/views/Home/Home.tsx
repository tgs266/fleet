/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import TitledCard from '../../components/Cards/TitledCard';
import FillErrorBoundary from '../../components/FillErrorBoundary';
import RangeQueryLineChart from '../../components/MetricCharts/RangeQueryLineChart';
import NoMetrics from '../../components/NoMetrics';
import { useNavContext } from '../../layouts/Navigation';
import Electron from '../../services/electron.service';
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
        if (Electron.isElectron) {
            Electron.getCurrentCluster().then((r) => {
                setState({
                    breadcrumbs: [
                        {
                            text: `Home`,
                        },
                    ],
                    menu: null,
                    buttons: [<div>{Electron.isElectron ? `Cluster: ${r.data}` : ''}</div>],
                });
            });
        }
    }, []);

    if (!metrics) {
        return null;
    }

    const getMetricsChart = (name: string, label: string, bytes: boolean) => {
        if (metrics[name]) {
            const data: any = {};
            const labels: any = {};
            data[name] = metrics[name];
            labels[name] = label;
            return <RangeQueryLineChart data={data} height="215px" labels={labels} bytes={bytes} />;
        }
        return <NoMetrics height="215px" />;
    };

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
                <TitledCard
                    titleMarginBottom="0"
                    title="CPU Core Usage"
                    style={{ width: 'calc(50% - 0.5em)', marginRight: '0.5em' }}
                >
                    {getMetricsChart('cpuUsage', 'kubernetes_node', false)}
                </TitledCard>
                <TitledCard
                    titleMarginBottom="0"
                    title="Memory Usage"
                    style={{ width: 'calc(50% - 0.5em)', marginLeft: '0.5em' }}
                >
                    {getMetricsChart('memoryUsage', 'kubernetes_node', true)}
                </TitledCard>
            </div>
            <TitledCard title="Resource Allocations">
                <FillErrorBoundary errorComponent={<NoMetrics />}>
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
                </FillErrorBoundary>
            </TitledCard>
        </div>
    );
}

/* eslint-disable default-case */
import { AxiosResponse } from 'axios';
import { JSONObjectType } from '../models/json.model';
import {
    MetricsQueryName,
    MetricsQueryOptions,
    PrometheusQueryResponse,
    PrometheusRangeQuery,
    PrometheusResponse,
} from '../models/prometheus.model';
import api from './axios.service';
import K8 from './k8.service';

export default class Prometheus {
    static accuracy: string = '1m';

    static queryRange(
        query: JSONObjectType<PrometheusRangeQuery>
    ): Promise<AxiosResponse<JSONObjectType<PrometheusResponse<PrometheusQueryResponse>>>> {
        return api.post('/api/v1/metrics/query/range', query);
    }

    static pollQueryRange(
        query: JSONObjectType<PrometheusRangeQuery>,
        callback: (
            resp: AxiosResponse<JSONObjectType<PrometheusResponse<PrometheusQueryResponse>>>
        ) => void,
        timerCallback: (timer: NodeJS.Timer) => void
    ) {
        this.queryRange(query).then((resp1) => {
            callback(resp1);
            const timer = K8.pollFunction(30 * 1000, () => {
                this.queryRange(query).then((resp2) => {
                    callback(resp2);
                });
            });
            timerCallback(timer);
        });
    }

    static buildRangeQuery(
        queryName: MetricsQueryName,
        options: MetricsQueryOptions
    ): PrometheusRangeQuery {
        switch (options.resource) {
            case 'node': {
                switch (queryName) {
                    case 'memoryUsage': {
                        return {
                            query: `(node_memory_MemTotal_bytes{kubernetes_node="${options.name}"} - 
                                    (node_memory_MemFree_bytes{kubernetes_node="${options.name}"} + 
                                    node_memory_Buffers_bytes{kubernetes_node="${options.name}"} + 
                                    node_memory_Cached_bytes{kubernetes_node="${options.name}"}))`,
                        };
                    }
                    case 'cpuUsage': {
                        return {
                            query: `sum(rate(node_cpu_seconds_total{mode=~"user|system", kubernetes_node="${options.name}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                    case 'networkRecieved': {
                        return {
                            query: `sum(rate(node_network_receive_bytes_total{kubernetes_node="${options.name}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                    case 'networkTransmitted': {
                        return {
                            query: `sum(rate(node_network_transmit_bytes_total{kubernetes_node="${options.name}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                }
                break;
            }
            case 'pod': {
                switch (queryName) {
                    case 'memoryUsage': {
                        return {
                            query: `sum(rate(container_memory_usage_bytes{container!="POD",container!="",pod=~"${options.name}",namespace="${options.namespace}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                    case 'cpuUsage': {
                        return {
                            query: `sum(rate(container_cpu_usage_seconds_total{container!="POD",container!="",pod=~"${options.name}",namespace="${options.namespace}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                    case 'networkRecieved': {
                        return {
                            query: `sum(rate(container_network_receive_bytes_total{pod=~"${options.name}",namespace="${options.namespace}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                    case 'networkTransmitted': {
                        return {
                            query: `sum(rate(container_network_transmit_bytes_total{pod=~"${options.name}",namespace="${options.namespace}"}[${Prometheus.accuracy}]))`,
                        };
                    }
                }
            }
        }
        return null;
    }
}

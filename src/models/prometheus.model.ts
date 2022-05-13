import { JSONObject, JSONObjectType } from './json.model';

export interface PrometheusRangeQuery {
    query: string;
    start?: string;
    end?: string;
    step?: string;
}

export interface AlertResponse {
    status: 'success' | 'error';
    data: {
        alerts: {
            activeAt: string;
            annotations: JSONObjectType<string>;
            labels: JSONObjectType<string>;
            state: string;
            value: string;
        }[];
    };
}

export interface PrometheusResponse<T> {
    status: 'success' | 'error';
    data: T;
    errorType: string;
    error: string;
    warnings: string[];
}

export interface PrometheusQueryResponse {
    resultType: string;
    result: {
        metric: JSONObject;
        value: [number, string];
    }[];
}

export interface PrometheusRangeQueryResponse {
    resultType: string;
    result: {
        metric: JSONObject;
        values: [number, string][];
    }[];
}

export interface MetricsQueryOptions {
    resource: 'cluster' | 'node' | 'pod';
    namespace?: string;
    name?: string;
    scale?: number;
}

export declare type MetricsQueryName =
    | 'memoryUsage'
    | 'memoryCapacity'
    | 'cpuUsage'
    | 'cpuCapacity'
    | 'podUsage'
    | 'podCapacity'
    | 'networkRecieved'
    | 'networkTransmitted';

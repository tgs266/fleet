import { JSONObject } from './json.model';

export interface PrometheusRangeQuery {
    query: string;
    start?: string;
    end?: string;
    step?: string;
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
        values: [number, string][];
    }[];
}

export interface MetricsQueryOptions {
    resource: 'node' | 'pod';
    namespace?: string;
    name?: string;
    scale?: number;
}

export declare type MetricsQueryName =
    | 'memoryUsage'
    | 'cpuUsage'
    | 'networkRecieved'
    | 'networkTransmitted';

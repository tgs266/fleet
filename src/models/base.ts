import { JSONObject } from './json.model';

export interface BaseMeta {
    name: string;
    uid: string;
    createdAt: number;
    annotations: JSONObject;
    labels: JSONObject;
}

export interface Tolerance {
    key: string;
    operator: string;
    value: string;
    effect: string;
    tolerationSeconds: number;
}

export interface NamespacedMeta extends BaseMeta {
    namespace: string;
}

export interface Condition {
    type: string;
    status: string;
    lastProbeTime: number;
    lastTransitionTime: number;
    reason: string;
    message: string;
}

export interface PaginationResponse<T> {
    items: T[];
    count: number;
    total: number;
    offset: number;
}

export interface FleetError {
    code: number;
    status: string;
    message: string;
}

export interface Filter {
    property: string;
    operator: string;
    value: number | string;
}

export interface Rule {
    verbs: string[];
    apiGroups: string[];
    resources: string[];
    resourceNames: string[];
    nonResourceURLs: string[];
}

export interface Subject {
    name: string;
    namespace: string;
    kind: string;
    apiGroup: string;
}

import { NamespacedMeta } from './base';
import { JSONObject } from './json.model';
import { Pod } from './pod.model';

export interface ServicePort {
    name: string;
    protocol: string;
    appProtocol: string;
    port: number;
    targetPort: number | string;
    nodePort: number;
}

export interface EndpointPort {
    name: string;
    port: number;
    protocol: string;
    appProtocol: string;
}

export interface Endpoint {
    host: string;
    ready: string;
    nodeName: string;
    ports: EndpointPort[];
}

export interface ServiceMeta extends NamespacedMeta {
    type: string;
    ports: ServicePort[];
}

export interface Service extends ServiceMeta {
    selector: JSONObject;
    clusterIp: string;
    pods: Pod[];
    endpoints: Endpoint[];
}

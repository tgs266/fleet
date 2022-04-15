import { ContainerSpec } from './container.model';
import { JSONObject } from './json.model';
import { Pod } from './pod.model';

export interface App {
    name: string;
    kind: string;
    age: number;
    readyReplicas: number;
    replicas: number;
    namespace: string;
    cluster: string;
    uid: string;
}

export interface CreateApp {
    name: string;
    namespace: string;
    replicas: number;
    containerSpecs: ContainerSpec[];
}

export interface AppDetails extends App {
    uid: string;
    containerCount: number;
    pods: Pod[];
    paused: boolean;
    containerSpecs: ContainerSpec[];
    labels: JSONObject;
    annotations: JSONObject;
}

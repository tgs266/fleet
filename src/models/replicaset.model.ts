import { NamespacedMeta, Tolerance } from './base';
import { Pod } from './pod.model';

export interface Owner {
    name: string;
    kind: string;
}

export interface ReplicaSetMeta extends NamespacedMeta {
    readyReplicas: number;
    replicas: number;
    owners: Owner[];
}

export interface ReplicaSet extends ReplicaSetMeta {
    pods: Pod[];
    tolerances: Tolerance[];
}

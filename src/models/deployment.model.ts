import { Condition, NamespacedMeta } from './base';
import { ContainerSpec } from './container.model';
import { Pod } from './pod.model';
import { Service } from './service.model';

export interface DeploymentMeta extends NamespacedMeta {
    readyReplicas: number;
    replicas: number;
}

export interface CreateDeployment {
    name: string;
    namespace: string;
    replicas: number;
    containerSpecs: ContainerSpec[];
}

export interface Deployment extends DeploymentMeta {
    containerCount: number;
    pods: Pod[];
    containerSpecs: ContainerSpec[];
    services: Service[];
    conditions: Condition[];
}

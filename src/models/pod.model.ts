import { Condition, NamespacedMeta } from './base';
import { Container } from './container.model';

export interface PodStatus {
    reason: string;
    genericStatus: string;
}

export interface PodAllocations {}

export interface PodResources {
    cpuLimit: number;
    cpuRequests: number;
    cpuUsage: number;
    cpuUsageLimitFraction: number;
    cpuUsageRequestsFraction: number;

    memoryLimit: number;
    memoryRequests: number;
    memoryUsage: number;
    memoryUsageLimitFraction: number;
    memoryUsageRequestsFraction: number;
}

export interface PodMeta extends NamespacedMeta {
    status: PodStatus;
    nodeName: string;
    restarts: number;
}

export interface Pod extends PodMeta {
    ip: string;
    resources: PodResources;
    containers: Container[];
    conditions: Condition[];
}

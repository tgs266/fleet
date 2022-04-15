import { BaseMeta, PaginationResponse } from './base';
import { PodMeta } from './pod.model';

export interface NodeResources {
    memoryCapacity: number;
    cpuCapacity: number;
    podCapacity: number;

    allocatedPods: number;
    allocatedPodFraction: number;

    memoryRequests: number;
    memoryLimit: number;
    memoryRequestsFraction: number;
    memoryLimitFraction: number;

    cpuRequests: number;
    cpuLimit: number;
    cpuRequestsFraction: number;
    cpuLimitFraction: number;
}

export interface NodeMeta extends BaseMeta {
    nodeResources: NodeResources;
}

interface NodeAddress {
    type: string;
    address: string;
}

interface NodeInfo {
    machineID: string;
    systemUUID: string;
    bootID: string;
    kernelVersion: string;
    osImage: string;
    containerRuntimeVersion: string;
    kubeletVersion: string;
    kubeProxyVersion: string;
    operatingSystem: string;
    architecture: string;
}

export interface Node extends NodeMeta {
    podCIDR: string;
    addresses: NodeAddress[];
    nodeInfo: NodeInfo;

    pods: PaginationResponse<PodMeta>;
}

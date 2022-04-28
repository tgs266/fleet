/* eslint-disable import/prefer-default-export */
import { ClusterRole, ClusterRoleBinding } from '../models/clusterrole.model';
import { Container, ContainerSpec } from '../models/container.model';
import { Deployment } from '../models/deployment.model';
import { Node } from '../models/node.model';
import { Pod } from '../models/pod.model';
import { Role, RoleBinding } from '../models/role.model';
import { ServiceMeta } from '../models/service.model';
import { ServiceAccount } from '../models/serviceaccount.model';
import { SystemResources } from '../models/system.model';

export const generateRoleBinding = (name: string): RoleBinding => ({
    name,
    namespace: 'test',
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    roleName: 'asdf',
    subjects: [
        {
            name: 'asdf',
            namespace: 'asdf',
            kind: 'group',
        },
    ],
});

export const generateClusterRoleBinding = (name: string): ClusterRoleBinding => ({
    name,
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    roleName: 'asdf',
    subjects: [
        {
            name: 'asdf',
            namespace: 'asdf',
            kind: 'group',
        },
    ],
});

export const generateRole = (name: string): Role => ({
    name,
    namespace: 'test',
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    rules: [
        {
            verbs: [],
            apiGroups: ['asdf'],
            nonResourceURLs: [],
            resourceNames: [],
            resources: ['pods'],
        },
    ],
});

export const generateClusterRole = (name: string): ClusterRole => ({
    name,
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    rules: [
        {
            verbs: [],
            apiGroups: ['asdf'],
            nonResourceURLs: [],
            resourceNames: [],
            resources: ['pods'],
        },
    ],
});

export const generateServiceAccount = (name: string): ServiceAccount => ({
    name,
    namespace: 'asdf',
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    roleBindings: [
        {
            name: 'asdf',
            namespace: 'asdf',
            roleName: 'asdf',
            createdAt: 0,
            labels: {},
            annotations: {},
            uid: 'UID',
        },
    ],
    clusterRoleBindings: [
        {
            name: 'asdf',
            roleName: 'asdf',
            createdAt: 0,
            labels: {},
            annotations: {},
            uid: 'UID',
        },
    ],
});

export const generatePod = (name: string): Pod => ({
    namespace: 'test',
    restarts: 1,
    nodeName: 'test',
    status: {
        reason: 'because',
        genericStatus: 'status',
    },
    conditions: [
        {
            type: 'asdf',
            status: 'asdf',
            reason: 'asdf',
            message: 'asdf',
            lastProbeTime: 0,
            lastTransitionTime: 0,
        },
    ],
    uid: 'uid',
    name,
    createdAt: 1,
    labels: {},
    annotations: {},
    ip: 'test-ip',
    containers: [
        {
            name: 'container 1',
            image: {
                name: 'my-image',
                tag: 'latest',
            },
            ports: [],
            envVars: [],
            state: 'Running',
            imagePullPolicy: 'policy',
            cpuRequests: 0,
            memRequests: 0,
            cpuLimit: 0,
            memLimit: 0,
            cpuUsage: 0,
            memUsage: 0,
        },
        {
            name: 'container 2',
            image: {
                name: 'my-image',
                tag: 'latest',
            },
            ports: [
                {
                    hostIp: 'asdf',
                    hostPort: 80,
                    protocol: 'TCP',
                    containerPort: 12,
                },
            ],
            envVars: [],
            state: 'Waiting',
            imagePullPolicy: 'policy',
            cpuRequests: 0,
            memRequests: 0,
            cpuLimit: 0,
            memLimit: 0,
            cpuUsage: 0,
            memUsage: 0,
        },
        {
            name: 'container 3',
            image: {
                name: 'my-image',
                tag: 'latest',
            },
            ports: [
                {
                    hostIp: 'asdf',
                    hostPort: 80,
                    protocol: 'UDP',
                    containerPort: 12,
                },
            ],
            envVars: [],
            state: 'Failed',
            imagePullPolicy: 'policy',
            cpuRequests: 0,
            memRequests: 0,
            cpuLimit: 0,
            memLimit: 0,
            cpuUsage: 0,
            memUsage: 0,
        },
        {
            name: 'container 4',
            image: {
                name: 'my-image',
                tag: 'latest',
            },
            ports: [
                {
                    hostIp: 'asdf',
                    hostPort: 80,
                    protocol: 'UDP',
                    containerPort: 12,
                },
            ],
            envVars: [],
            state: 'Unknown',
            imagePullPolicy: 'policy',
            cpuRequests: 0,
            memRequests: 0,
            cpuLimit: 0,
            memLimit: 0,
            cpuUsage: 0,
            memUsage: 0,
        },
        {
            name: 'container 5',
            image: {
                name: 'my-image',
                tag: 'latest',
            },
            ports: [
                {
                    hostIp: 'asdf',
                    hostPort: 80,
                    protocol: 'UDP',
                    containerPort: 12,
                },
            ],
            envVars: [],
            state: '',
            imagePullPolicy: 'policy',
            cpuRequests: 100,
            memRequests: 100,
            cpuLimit: 100,
            memLimit: 100,
            cpuUsage: 10,
            memUsage: 100,
        },
    ],
    resources: {
        cpuRequests: 0,
        memoryRequests: 0,
        cpuLimit: 0,
        memoryLimit: 0,
        cpuUsageLimitFraction: 0,
        memoryUsageLimitFraction: 0,
        cpuUsageRequestsFraction: 0,
        memoryUsageRequestsFraction: 0,
        cpuUsage: 0,
        memoryUsage: 0,
    },
});

export const generateContainer = (name: string, state: string = 'Running'): Container => ({
    name,
    image: {
        name: 'my-image',
        tag: 'latest',
    },
    ports: [
        {
            protocol: 'TCP',
            containerPort: 10,
            hostPort: 10,
            hostIp: 'asdf',
        },
        {
            protocol: 'UDP',
            containerPort: 10,
            hostPort: 10,
            hostIp: 'asdf',
        },
        {
            protocol: 'SCTP',
            containerPort: 10,
            hostPort: 0,
            hostIp: 'asdf',
        },
        {
            protocol: '',
            containerPort: 10,
            hostPort: 10,
            hostIp: '',
        },
    ],
    envVars: [
        {
            name: 'test',
            value: 'asdf',
        },
    ],
    state,
    imagePullPolicy: 'policy',
    cpuRequests: 0,
    memRequests: 0,
    cpuLimit: 0,
    memLimit: 0,
    cpuUsage: 0,
    memUsage: 0,
});

export const generateSystemResources = (): SystemResources => ({
    cpu: {
        cores: 8,
    },
    memory: {
        free: 1000000,
        total: 10000000,
    },
});

export const generateDeployment = (name: string): Deployment => ({
    name,
    createdAt: 0,
    labels: {
        asdf: 'asdf',
    },
    annotations: {
        asdf: 'asdf',
    },
    uid: 'asdf',
    namespace: 'test',
    containerCount: 3,
    pods: [generatePod('test1'), generatePod('test2'), generatePod('test3')],
    containerSpecs: [generateContainer('asdf') as ContainerSpec],
    replicas: 3,
    readyReplicas: 3,
    services: [],
    conditions: [
        {
            type: 'asdf',
            status: 'asdf',
            reason: 'asdf',
            message: 'asdf',
            lastProbeTime: 0,
            lastTransitionTime: 0,
        },
    ],
});

export const generateNode = (name: string = 'test'): Node => ({
    podCIDR: 'asdf',
    name,
    createdAt: 0,
    labels: {
        asdf: 'adsf',
    },
    annotations: { asdf: 'asdf' },
    uid: name,
    nodeResources: {
        memoryCapacity: 10,
        cpuCapacity: 10,
        podCapacity: 100,

        allocatedPods: 10,
        allocatedPodFraction: 0.1,

        memoryRequests: 1,
        memoryLimit: 1,
        memoryRequestsFraction: 0.1,
        memoryLimitFraction: 0.1,

        cpuRequests: 1,
        cpuLimit: 1,
        cpuRequestsFraction: 0.1,
        cpuLimitFraction: 0.1,
    },
    addresses: [
        {
            type: 't',
            address: 'asdf',
        },
    ],
    pods: {
        total: 2,
        items: [generatePod('asdf'), generatePod('2')],
        count: 2,
        offset: 0,
    },
    nodeInfo: {
        machineID: 'string',
        systemUUID: 'string',
        bootID: 'string',
        kernelVersion: 'string',
        osImage: 'string',
        containerRuntimeVersion: 'string',
        kubeletVersion: 'string',
        kubeProxyVersion: 'string',
        operatingSystem: 'string',
        architecture: 'string',
    },
});

export const generateServiceMeta = (name: string): ServiceMeta => ({
    name,
    namespace: 'asdf',
    createdAt: 0,
    uid: name,
    annotations: { asdf: 'asdf' },
    labels: { asdf: 'asdf' },
    type: 'a',
    ports: [
        {
            name: '1',
            port: 90,
            protocol: 'UDP',
            appProtocol: 'asdf',
            targetPort: 90,
            nodePort: 3,
        },
    ],
});

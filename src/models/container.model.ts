import { Image } from './image.model';

export interface Port {
    containerPort: number;
    hostPort: number;
    hostIp: string;
    protocol: string;
}

export interface Env {
    name: string;
    value: string;
}

export interface ContainerSpec {
    name: string;
    image: Image;
    ports: Port[];
    envVars: Env[];
    cpuRequests: number;
    cpuLimit: number;
    memRequests: number;
    memLimit: number;
}

export interface Container extends ContainerSpec {
    state: string;
    imagePullPolicy: string;
    cpuUsage?: number;
    memUsage?: number;
}

export interface SystemMemory {
    free: number;
    total: number;
}

export interface SystemCPU {
    cores: number;
}

export interface SystemResources {
    cpu: SystemCPU;
    memory: SystemMemory;
}

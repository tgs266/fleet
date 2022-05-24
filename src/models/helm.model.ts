export interface Chart {
    name: string;
    version: string;
    appVersion: string;
    description: string;
    icon: string;
    repo: string;
    readme: string;
    deprecated: boolean;
    keywords: string[];
    home: string;
    values: string;
    maintainers: { name: string; email: string }[];
}

export interface Resource {
    kind: string;
    metadata: {
        name: string;
        namespace: string;
    };
}

export interface Release {
    name: string;
    namespace: string;
    resources: Resource[];
    info: {
        status: string;
        notes: string;
    };
    chart: {
        metadata: Chart;
    };
}

export interface ChartInstall {
    repo: string;
    value: string;
    chartName: string;
    releaseName: string;
    namespace: string;
    version: string;
}

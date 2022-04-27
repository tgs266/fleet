export const buildLinkToPod = (namespace: string, podName: string) =>
    `/pods/${namespace}/${podName}`;

export const buildLinkToDeployment = (deployment: string, namespace: string) =>
    `/deployments/${namespace}/${deployment}`;

export const buildLinkToContainerSpec = (
    deployment: string,
    namespace: string,
    containerSpecName: string
) => `/deployments/${namespace}/${deployment}/container-spec/${containerSpecName}`;

export const buildLinkToContainer = (namespace: string, podName: string, containerName: string) =>
    `/pods/${namespace}/${podName}/containers/${containerName}`;

export const buildLinkToService = (namespace: string, serviceName: string) =>
    `/services/${namespace}/${serviceName}`;

export const buildLinkToNode = (nodeName: string) => `/nodes/${nodeName}`;

export const buildLinkToNamespace = (ns: string) => `/namespaces/${ns}`;

export const buildLinkToRole = (ns: string, roleName: string) => `/roles/${ns}/${roleName}`;

export const buildLinkToServiceAccount = (ns: string, sa: string) => `/serviceaccounts/${ns}/${sa}`;

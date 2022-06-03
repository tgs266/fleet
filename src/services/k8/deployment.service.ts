/* eslint-disable class-methods-use-this */
/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { ContainerSpec } from '../../models/container.model';
import { CreateDeployment, Deployment, DeploymentMeta } from '../../models/deployment.model';
import api, { getBackendApiUrl, getWSUrl } from '../axios.service';
import getWebsocket from '../websocket';
import Resource, { ResourceGetParams } from './resource.service';

export default class Deployments extends Resource<DeploymentMeta, Deployment> {
    static base = `/api/v1/deployments`;

    base = Deployments.base;

    restartApp(params: ResourceGetParams): Promise<AxiosResponse<any>> {
        return api.put(
            `${getBackendApiUrl(Deployments.base)}/${params.namespace}/${params.name}/restart`
        );
    }

    updateContainerSpec(
        params: ResourceGetParams,
        oldSpecName: string,
        newSpec: ContainerSpec
    ): Promise<AxiosResponse<any>> {
        return api.put(
            `${getBackendApiUrl(Deployments.base)}/${params.namespace}/${
                params.name
            }/container-specs/${oldSpecName}`,
            newSpec
        );
    }

    createDeployment(dep: CreateDeployment): Promise<AxiosResponse<any>> {
        return api.post(`${getBackendApiUrl(Deployments.base)}/`, {
            namespace: dep.namespace,
            name: dep.name,
            containerSpecs: dep.containerSpecs,
            replicas: dep.replicas,
        });
    }

    scale(params: ResourceGetParams, replicas: number): Promise<AxiosResponse<any>> {
        return api.put(
            `${getBackendApiUrl(Deployments.base)}/${params.namespace}/${params.name}/scale`,
            {
                replicas,
            }
        );
    }

    openEventWebsocket(
        params: ResourceGetParams,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const token = localStorage.getItem('jwe');
        const ws = getWebsocket(
            getWSUrl(
                `/ws/v1/deployments/${params.namespace}/${params.name}/events?pollInterval=${pollInterval}&jwe=${token}`
            )
        );
        ws.onmessage = callback;
        return ws;
    }
}

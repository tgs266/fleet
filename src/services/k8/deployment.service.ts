/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { ContainerSpec } from '../../models/container.model';
import { CreateDeployment, Deployment, DeploymentMeta } from '../../models/deployment.model';
import { JSONObject } from '../../models/json.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl, getWSUrl } from '../axios.service';
import getWebsocket from '../websocket';

export default class Deployments {
    static base = `/api/v1/deployments`;

    static getDeployments(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<DeploymentMeta>>> {
        return api.get(`${getBackendApiUrl(Deployments.base)}/${namespace || '_all_'}`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy: parseFilters(filters) },
        });
    }

    static getDeployment(
        deployment: string,
        namespace: string
    ): Promise<AxiosResponse<Deployment>> {
        return api.get(`${getBackendApiUrl(Deployments.base)}/${namespace}/${deployment}`);
    }

    static getRawDeployment(
        deployment: string,
        namespace: string
    ): Promise<AxiosResponse<JSONObject>> {
        return api.get(`${getBackendApiUrl('/api/v1/raw/deployments')}/${namespace}/${deployment}`);
    }

    static updateRawDeployment(
        deployment: string,
        namespace: string,
        dep: JSONObject
    ): Promise<AxiosResponse<JSONObject>> {
        return api.put(
            `${getBackendApiUrl('/api/v1/raw/deployments')}/${namespace}/${deployment}`,
            dep
        );
    }

    static restartApp(deployment: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.put(`${getBackendApiUrl(Deployments.base)}/${namespace}/${deployment}/restart`);
    }

    static updateContainerSpec(
        deployment: string,
        namespace: string,
        oldSpecName: string,
        newSpec: ContainerSpec
    ): Promise<AxiosResponse<any>> {
        return api.put(
            `${getBackendApiUrl(
                Deployments.base
            )}/${namespace}/${deployment}/container-specs/${oldSpecName}`,
            newSpec
        );
    }

    static createDeployment(dep: CreateDeployment): Promise<AxiosResponse<any>> {
        return api.post(`${getBackendApiUrl(Deployments.base)}/`, {
            namespace: dep.namespace,
            name: dep.name,
            containerSpecs: dep.containerSpecs,
            replicas: dep.replicas,
        });
    }

    static deleteDeployment(deployment: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.delete(`${getBackendApiUrl(Deployments.base)}/${namespace}/${deployment}`);
    }

    static scale(
        deployment: string,
        namespace: string,
        replicas: number
    ): Promise<AxiosResponse<any>> {
        return api.put(`${getBackendApiUrl(Deployments.base)}/${namespace}/${deployment}/scale`, {
            replicas,
        });
    }

    static openEventWebsocket(
        deployment: string,
        namespace: string,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const token = localStorage.getItem('jwe');
        const ws = getWebsocket(
            getWSUrl(
                `/ws/v1/deployments/${namespace}/${deployment}/events?pollInterval=${pollInterval}&jwe=${token}`
            )
        );
        ws.onmessage = callback;
        return ws;
    }
}

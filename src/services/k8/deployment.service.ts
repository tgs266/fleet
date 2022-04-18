/* eslint-disable object-shorthand */
import axios, { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { ContainerSpec } from '../../models/container.model';
import { CreateDeployment, Deployment, DeploymentMeta } from '../../models/deployment.model';
import { JSONObject } from '../../models/json.model';
import api from '../axios.service';

export default class Deployments {
    static base = 'http://localhost:51115/api/v1/deployments';

    static getDeployments(
        namespace?: string,
        sort?: TableSort
    ): Promise<AxiosResponse<PaginationResponse<DeploymentMeta>>> {
        let sortBy = '';
        if (sort) {
            sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
        }
        return api.get(`${Deployments.base}/${namespace || '_all_'}`, { params: { sortBy } });
    }

    static getDeployment(
        deployment: string,
        namespace: string
    ): Promise<AxiosResponse<Deployment>> {
        return api.get(`${Deployments.base}/${namespace}/${deployment}`);
    }

    static getRawDeployment(
        deployment: string,
        namespace: string
    ): Promise<AxiosResponse<JSONObject>> {
        return api.get(`http://localhost:51115/api/v1/raw/deployments/${namespace}/${deployment}`);
    }

    static updateRawDeployment(
        deployment: string,
        namespace: string,
        dep: JSONObject
    ): Promise<AxiosResponse<JSONObject>> {
        return axios.put(
            `http://localhost:51115/api/v1/raw/deployments/${namespace}/${deployment}`,
            dep
        );
    }

    static restartApp(deployment: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.put(`${Deployments.base}/${namespace}/${deployment}/restart`);
    }

    static updateContainerSpec(
        deployment: string,
        namespace: string,
        oldSpecName: string,
        newSpec: ContainerSpec
    ): Promise<AxiosResponse<any>> {
        return api.put(
            `${Deployments.base}/${namespace}/${deployment}/container-specs/${oldSpecName}`,
            newSpec
        );
    }

    static createDeployment(dep: CreateDeployment): Promise<AxiosResponse<any>> {
        return api.post(`${Deployments.base}/`, {
            namespace: dep.namespace,
            name: dep.name,
            containerSpecs: dep.containerSpecs,
            replicas: dep.replicas,
        });
    }

    static deleteDeployment(deployment: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.delete(`${Deployments.base}/${namespace}/${deployment}`);
    }

    static scale(
        deployment: string,
        namespace: string,
        replicas: number
    ): Promise<AxiosResponse<any>> {
        return axios.put(`${Deployments.base}/${namespace}/${deployment}/scale`, {
            replicas,
        });
    }

    static openEventWebsocket(
        deployment: string,
        namespace: string,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const ws = new WebSocket(
            `ws://localhost:51115/ws/v1/deployments/${namespace}/${deployment}/events?pollInterval=${pollInterval}`
        );
        ws.onmessage = callback;
        return ws;
    }
}

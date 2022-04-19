import axios, { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { JSONObject } from '../../models/json.model';
import { Pod, PodMeta } from '../../models/pod.model';
import api from '../axios.service';

export default class Pods {
    static base = '/api/v1/pods';

    static getPod(podName: string, namespace?: string): Promise<AxiosResponse<Pod>> {
        return api.get(`${Pods.base}/${namespace}/${podName}`);
    }

    static getPods(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<PodMeta>>> {
        let sortBy = '';
        if (sort) {
            sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
        }
        return api.get(`${Pods.base}/${namespace || '_all_'}`, {
            params: { sortBy, offset, pageSize },
        });
    }

    static restartPod(podName: string, namespace?: string): Promise<AxiosResponse<any>> {
        return api.post(`${Pods.base}/${namespace}/${podName}/restart`);
    }

    static deletePod(pod: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.delete(`${Pods.base}/${namespace}/${pod}/`);
    }

    static openEventWebsocket(
        pod: string,
        namespace: string,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const ws = new WebSocket(
            `ws://localhost:9095/ws/v1/pods/${namespace}/${pod}/events?pollInterval=${pollInterval}`
        );
        ws.onmessage = callback;
        return ws;
    }

    static getRawPod(pod: string, namespace: string): Promise<AxiosResponse<JSONObject>> {
        return api.get(`/api/v1/raw/pods/${namespace}/${pod}`);
    }

    static updateRawPod(
        pod: string,
        namespace: string,
        p: JSONObject
    ): Promise<AxiosResponse<JSONObject>> {
        return axios.put(`/api/v1/raw/pods/${namespace}/${pod}`, p);
    }
}

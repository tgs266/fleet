import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { JSONObject } from '../../models/json.model';
import { Pod, PodMeta } from '../../models/pod.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl, getWSUrl } from '../axios.service';
import getWebsocket from '../websocket';

export default class Pods {
    static base = `/api/v1/pods`;

    static getPod(podName: string, namespace?: string): Promise<AxiosResponse<Pod>> {
        return api.get(`${getBackendApiUrl(Pods.base)}/${namespace}/${podName}`);
    }

    static getPods(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<PodMeta>>> {
        return api.get(`${getBackendApiUrl(Pods.base)}/${namespace || '_all_'}`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy: parseFilters(filters) },
        });
    }

    static restartPod(podName: string, namespace?: string): Promise<AxiosResponse<any>> {
        return api.post(`${getBackendApiUrl(Pods.base)}/${namespace}/${podName}/restart`);
    }

    static deletePod(pod: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.delete(`${getBackendApiUrl(Pods.base)}/${namespace}/${pod}/`);
    }

    static openEventWebsocket(
        pod: string,
        namespace: string,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const token = localStorage.getItem('jwe');
        const ws = getWebsocket(
            getWSUrl(
                `/ws/v1/pods/${namespace}/${pod}/events?pollInterval=${pollInterval}&jwe=${token}`
            )
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
        return api.put(`/api/v1/raw/pods/${namespace}/${pod}`, p);
    }
}

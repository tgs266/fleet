import { AxiosResponse } from 'axios';
import { Pod, PodMeta } from '../../models/pod.model';
import api from '../axios.service';
import WS from '../websocket.service';
import Resource, { ResourceGetParams } from './resource.service';

export default class Pods extends Resource<PodMeta, Pod> {
    static base = `/api/v1/pods`;

    base = Pods.base;

    restartPod(params: ResourceGetParams): Promise<AxiosResponse<any>> {
        return api.post(`${this.getNamespaceNameUrl(params)}/restart`);
    }

    openEventWebsocket(
        params: ResourceGetParams,
        pollInterval: number,
        callback: (event: MessageEvent<string>) => void
    ): WS {
        const ws = this.getWebsocket(
            `/ws/v1/pods/${params.namespace}/${params.name}/events?pollInterval=${pollInterval}`
        );
        ws.ws.onmessage = callback;
        return ws;
    }
}

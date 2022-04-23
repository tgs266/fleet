/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { Container } from '../../models/container.model';
import api, { getWSUrl } from '../axios.service';

export default class Containers {
    static base = '/api/v1';

    static getContainer(
        podName: string,
        namespace: string,
        containerName: string
    ): Promise<AxiosResponse<Container>> {
        return api.get(
            `${Containers.base}/pods/${namespace}/${podName}/containers/${containerName}`
        );
    }

    static openLogWebsocket(
        podName: string,
        namespace: string,
        containerName: string,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const ws = new WebSocket(
            getWSUrl(`/ws/v1/pods/${namespace}/${podName}/containers/${containerName}/logs`)
        );
        ws.onmessage = callback;
        return ws;
    }
}

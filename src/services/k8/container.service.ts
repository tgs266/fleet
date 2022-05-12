/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { Container } from '../../models/container.model';
import api, { getBackendApiUrl, getWSUrl } from '../axios.service';
import getWebsocket from '../websocket';

export default class Containers {
    static base = `/api/v1`;

    static getContainer(
        podName: string,
        namespace: string,
        containerName: string
    ): Promise<AxiosResponse<Container>> {
        return api.get(
            `${getBackendApiUrl(
                Containers.base
            )}/pods/${namespace}/${podName}/containers/${containerName}`
        );
    }

    static openLogWebsocket(
        podName: string,
        namespace: string,
        containerName: string,
        callback: (event: MessageEvent<string>) => void
    ): WebSocket {
        const token = localStorage.getItem('jwe');
        const ws = getWebsocket(
            getWSUrl(
                `/ws/v1/pods/${namespace}/${podName}/containers/${containerName}/logs?jwe=${token}`
            )
        );
        ws.onmessage = callback;
        return ws;
    }
}

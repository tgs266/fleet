/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
// import EventSourcePolyfill from 'eventsource';
import { FleetError } from '../models/base';
import { JSONObjectType } from '../models/json.model';
import { handleFleetError } from './axios.service';

export const buildWebsocket = (path: string, headers: JSONObjectType<string>) => {
    const u = new URL(path);
    for (const h of Object.keys(headers)) {
        u.searchParams.append(h, headers[h]);
    }
    return new WebSocket(u.toString());
};

export default class WS {
    path: string;

    interval: number;

    id: string;

    closed: boolean;

    ws: WebSocket;

    builder: (path: string, headers: JSONObjectType<string>) => WebSocket;

    static all: JSONObjectType<WS> = {};

    constructor(
        path: string,
        interval: number = 5000,
        builder: (path: string, headers: JSONObjectType<string>) => WebSocket = buildWebsocket
    ) {
        this.path = path;
        this.interval = interval;
        this.builder = builder;
    }

    headers = () => {
        const headers: JSONObjectType<string> = {};
        const token = localStorage.getItem('jwe');
        if (token) {
            headers.jweToken = token;
        }
        return headers;
    };

    subscribe<T>(
        messageHandler: (data: T) => any,
        errorHandler: (err: FleetError) => any = handleFleetError
    ) {
        this.ws = this.builder(`${this.path}?interval=${this.interval}`, this.headers());
        this.id = (Math.random() * 100000).toString();
        WS.all[this.id] = this;

        this.ws.onmessage = (ev: MessageEvent<string>) => {
            const data: T = JSON.parse(ev.data);
            messageHandler(data);
        };

        this.ws.onerror = (ev: MessageEvent<string>) => {
            const data: FleetError = JSON.parse(ev.data);
            errorHandler(data);
        };
        return this;
    }

    close() {
        WS.all[this.id] = null;
        this.ws.close();
        this.closed = true;
    }

    static closeAll() {
        for (const id of Object.keys(WS.all)) {
            if (WS.all[id]) {
                WS.all[id].close();
                delete WS.all[id];
            }
        }
    }
}

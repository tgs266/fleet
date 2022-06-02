/* eslint-disable class-methods-use-this */
/* eslint-disable no-restricted-syntax */
// import EventSourcePolyfill from 'eventsource';
import { FleetError } from '../models/base';
import { JSONObjectType } from '../models/json.model';
import { handleFleetError } from './axios.service';

export const buildEventSource = (path: string, headers: JSONObjectType<string>) => {
    const u = new URL(path);
    for (const h of Object.keys(headers)) {
        u.searchParams.append(h, headers[h]);
    }
    return new EventSource(u.toString());
};

export default class SSE {
    path: string;

    interval: number;

    id: string;

    paused: boolean;

    closed: boolean;

    eventSource: EventSource;

    builder: (path: string, headers: JSONObjectType<string>) => EventSource;

    static all: JSONObjectType<SSE> = {};

    constructor(
        path: string,
        interval: number = 5000,
        builder: (path: string, headers: JSONObjectType<string>) => EventSource = buildEventSource
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
        this.eventSource = this.builder(`${this.path}?interval=${this.interval}`, this.headers());
        this.id = (Math.random() * 100000).toString();
        SSE.all[this.id] = this;

        this.eventSource.onmessage = (ev: MessageEvent<string>) => {
            if (ev.data.startsWith('error: ')) {
                const inner = ev.data.slice(7);
                const parsed: FleetError = JSON.parse(inner);
                errorHandler(parsed);
            } else {
                const data: T = JSON.parse(ev.data);
                messageHandler(data);
            }
        };
        return this;
    }

    close() {
        SSE.all[this.id] = null;
        this.eventSource.close();
        this.closed = true;
    }

    pause() {
        if (!this.closed && !this.paused) {
            console.log('pausing');
            this.eventSource.close();
            this.paused = true;
        }
    }

    unpause() {
        if (this.closed || !this.paused) {
            return;
        }
        const tempES = this.builder(`${this.path}?interval=${this.interval}`, this.headers());
        tempES.onmessage = this.eventSource.onmessage;
        tempES.onerror = this.eventSource.onerror;
        this.eventSource = tempES;
    }

    static closeAll() {
        for (const id of Object.keys(SSE.all)) {
            if (SSE.all[id]) {
                SSE.all[id].close();
                delete SSE.all[id];
            }
        }
    }

    static pauseAll() {
        for (const id of Object.keys(SSE.all)) {
            SSE.all[id].pause();
        }
    }

    static startAll() {
        for (const id of Object.keys(SSE.all)) {
            SSE.all[id].unpause();
        }
    }
}

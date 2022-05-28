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

    eventSource: EventSource;

    builder: (path: string, headers: JSONObjectType<string>) => EventSource;

    constructor(
        path: string,
        interval: number = 5000,
        builder: (path: string, headers: JSONObjectType<string>) => EventSource = buildEventSource
    ) {
        this.path = path;
        this.interval = interval;
        this.builder = builder;
    }

    subscribe<T>(
        messageHandler: (data: T) => any,
        errorHandler: (err: FleetError) => any = handleFleetError
    ) {
        const headers: JSONObjectType<string> = {};
        const token = localStorage.getItem('jwe');
        if (token) {
            headers.jweToken = token;
        }
        this.eventSource = this.builder(`${this.path}?interval=${this.interval}`, headers);
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
        this.eventSource.close();
    }
}

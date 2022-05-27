// import EventSourcePolyfill from 'eventsource';
import { FleetError } from '../models/base';
import { JSONObjectType } from '../models/json.model';
import { handleFleetError } from './axios.service';

export default class SSE {
    path: string;

    interval: number;

    eventSource: EventSource;

    constructor(path: string, interval: number = 5000) {
        this.path = path;
        this.interval = interval;
    }

    subscribe<T>(
        messageHandler: (data: T) => any,
        errorHandler: (err: FleetError) => any = handleFleetError
    ) {
        const config = { headers: {} as JSONObjectType<string> };
        const token = localStorage.getItem('jwe');
        if (token) {
            config.headers.jweToken = token;
        }
        this.eventSource = new EventSource(`${this.path}?interval=${this.interval}`, {});
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
        this.eventSource.onerror = (ev: MessageEvent<any>) => {
            console.log(ev);
        };
        return this;
    }

    close() {
        this.eventSource.close();
    }
}

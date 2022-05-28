/* eslint-disable import/first */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
import SSE from './sse.service';

const ev: EventSource = {
    CLOSED: 0,
    CONNECTING: 0,
    OPEN: 0,
    dispatchEvent(event: Event): boolean {
        return false;
    },
    onerror: jest.fn(),
    onmessage: jest.fn(),
    onopen: jest.fn(),
    readyState: 0,
    url: '',
    withCredentials: false,
    addEventListener(
        type: any,
        listener: any,
        options?: boolean | AddEventListenerOptions
    ): void {},
    close(): void {},
    removeEventListener(
        type: any,
        listener: any,
        options?: boolean | EventListenerOptions
    ): void {},
};

const buildEventSourceSpy = jest.fn(() => ev);

test('success', () => {
    localStorage.setItem('jweToken', 'asdf');
    const x = new SSE('none', 1000, buildEventSourceSpy);
    const h = jest.fn();
    x.subscribe<string>(h, (e: any) => {});
    x.eventSource.onmessage(
        new MessageEvent('asdf', {
            data: '{"asdf": "asdf"}',
        })
    );
    expect(h).toHaveBeenCalled();
});

test('error', () => {
    localStorage.setItem('jweToken', 'asdf');
    const x = new SSE('none', 1000, buildEventSourceSpy);
    const h = jest.fn();
    x.subscribe<string>(h, (e: any) => {});
    x.eventSource.onmessage(
        new MessageEvent('asdf', {
            data: 'error: {"asdf": "asdf"}',
        })
    );
    expect(h).not.toHaveBeenCalled();
});

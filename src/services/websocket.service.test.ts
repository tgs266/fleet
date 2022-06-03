/* eslint-disable import/no-duplicates */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-new */
import { buildWebsocket } from './websocket.service';
import WS from './websocket.service';

test('can build ws', () => {
    buildWebsocket('ws://asdf.com', { asdf: 'asdf' });
});

test('can construct', () => {
    new WS('ws://asdf.com', 12, buildWebsocket);
    new WS('ws://asdf.com', 12);
    const x = new WS('ws://asdf.com');
    x.subscribe<any>(() => {});
    WS.closeAll();
});

test('can get headers', () => {
    const x = new WS('ws://asdf.com', 12, buildWebsocket);
    x.headers;
});

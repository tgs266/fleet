import { render } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import React from 'react';
import { getWSUrl } from '../../services/axios.service';
import { Operation } from './Fleet';
import FleetGroup from './FleetGroup';
import FleetManager from './FleetManager';
import { FleetSprite, GREEN } from './helper';
import { FleetObject } from './model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = new WS(getWSUrl('/ws/v1/fleet')); // WS('ws:///ws/v1/fleet');

const fleetData: FleetObject[] = [
    {
        mode: 'NEW',
        meta: {
            name: 'asdf',
            namespace: 'asdf',
            uid: 'g',
            details: {},
        },
        dimension: 'deployment',
        status: {
            reason: 'Running',
            color: GREEN,
            value: 'asdf',
        },
        children: {
            asdf: {
                mode: 'NEW',
                meta: {
                    name: 'asdf',
                    namespace: 'asdf',
                    uid: 'asdf',
                    details: {},
                },
                dimension: 'pod',
                status: {
                    reason: 'Running',
                    color: GREEN,
                    value: 'asdf',
                },
            },
            asdf2: {
                mode: 'NEW',
                meta: {
                    name: 'asdf2',
                    namespace: 'asdf',
                    uid: 'asdf2',
                    details: {},
                },
                dimension: 'pod',
                status: {
                    reason: 'Running',
                    color: GREEN,
                    value: 'asdf',
                },
            },
        },
    },
];

const getFm = () => {
    const ele = render(<div />).container as HTMLDivElement;
    const fm = new FleetManager(ele);

    fm.groups = {
        g: new FleetGroup('g', 'asdf', { x: 1, y: 1 }),
    };

    return { fm, ele };
};

const getOp = (id: string = 'asdf'): Operation => ({
    opId: Math.floor(Math.random() * 1000).toString(),
    mode: 'NEW',
    id,
    group: 'g',
    position: {
        x: 1,
        y: 2,
    },
    alpha: 1,
    progress: 0,
    stepSize: 1 / (400 / 16.6),
    tint: GREEN,
});

test('can create and destroy', async () => {
    getFm().fm.destroy();
});

test('can connect', async () => {
    const { fm } = getFm();
    fm.connect();
    await server.connected;
    fm.connect();
    fm.destroy();
});

test('can set dims', async () => {
    const { fm } = getFm();
    fm.setDim0('asdf');
    fm.setDim1('asdf');

    expect(fm.dim0).toBe('asdf');
    expect(fm.dim1).toBe('asdf');
});

test('can set listeners', async () => {
    const { fm, ele } = getFm();
    fm.dragPlugin.pointerDown = jest.fn();
    fm.dragPlugin.pointerUp = jest.fn();
    fm.dragPlugin.pointerMove = jest.fn();

    fm.addListeners(ele, () => {});

    const EventConstructor = window.PointerEvent || window.Event;
    let event: Event;
    if (typeof EventConstructor === 'function') {
        event = new EventConstructor('PointerEvent');
    } else {
        event = window.document.createEvent('PointerEvent');
    }

    ele.onpointerdown(null);
    ele.onpointerup(null);
    ele.onpointerleave(null);
    ele.onpointerout(null);

    ele.onpointermove(event as PointerEvent);

    expect(fm.dragPlugin.pointerDown).toHaveBeenCalled();
    expect(fm.dragPlugin.pointerUp).toHaveBeenCalled();
    expect(fm.dragPlugin.pointerMove).toHaveBeenCalled();
});

test('can handle dblclick', async () => {
    const { fm, ele } = getFm();

    fm.addListeners(ele, () => {});

    const EventConstructor = window.MouseEvent || window.Event;
    let event: Event;
    if (typeof EventConstructor === 'function') {
        event = new EventConstructor('MouseEvent');
    } else {
        event = window.document.createEvent('MouseEvent');
    }

    ele.ondblclick(event as MouseEvent);
});

test('can handle wheel', async () => {
    const { fm, ele } = getFm();

    fm.addListeners(ele, () => {});

    const EventConstructor = window.WheelEvent || window.Event;
    let event: Event;
    if (typeof EventConstructor === 'function') {
        event = new EventConstructor('WheelEvent');
    } else {
        event = window.document.createEvent('WheelEvent');
    }

    ele.onwheel(event as WheelEvent);
});

test('can pause', async () => {
    const { fm } = getFm();
    fm.pauseApp();
    expect(fm.paused).toBeTruthy();
    fm.pauseApp();
    expect(fm.paused).toBeFalsy();
});

test('can handleFinalUpdate ', async () => {
    const { fm } = getFm();

    const sprite = new FleetSprite();
    const op = getOp();

    fm.handleFinalUpdate(op, sprite);
});

test('can handleDeleteOperation ', async () => {
    const { fm } = getFm();

    const sprite = new FleetSprite();

    fm.addChild(sprite);
    const op = getOp();

    fm.handleDeleteOperation(op);
});

test('can handleDeleteOperation with progress 1 ', async () => {
    const { fm } = getFm();

    const sprite = new FleetSprite();
    sprite.name = 'asdf';
    const op = getOp();

    op.progress = 1.1;
    fm.addChild(sprite);

    fm.handleDeleteOperation(op);
});

test('can handleDeleteOperation with progress 1 and no name', async () => {
    const { fm } = getFm();

    const sprite = new FleetSprite();
    const op = getOp();

    op.progress = 1.1;
    fm.addChild(sprite);

    fm.handleDeleteOperation(op);
});

test('can handleDeleteOperation with no position', async () => {
    const { fm } = getFm();

    const sprite = new FleetSprite();
    sprite.name = 'asdf';
    const op = getOp();
    op.position = null;
    op.completeCallback = () => {};

    fm.addChild(sprite);

    fm.handleDeleteOperation(op);
});

test('can remove op', async () => {
    const { fm } = getFm();
    fm.operations.push(getOp());
    fm.removeOp(0);
    fm.removeOp(1);
});

test('can handleNewOrUpdateOperation with sprite', async () => {
    const { fm } = getFm();

    const sprite = new FleetSprite();

    sprite.name = 'asdf';
    fm.addChild(sprite);
    const op = getOp();

    fm.handleNewOrUpdateOperation(op, 0);
});

test('can handleNewOrUpdateOperation', async () => {
    const { fm } = getFm();
    const op = getOp();
    op.data = { asdf: 'asdf' };
    fm.handleNewOrUpdateOperation(op, 0);
});

test('can handleNewOrUpdateOperation with progress > 1', async () => {
    const { fm } = getFm();
    const op = getOp();
    op.progress = 1.1;
    fm.handleNewOrUpdateOperation(op, 0);
});

test('can run ops', async () => {
    const { fm } = getFm();
    fm.operations.push(getOp('1'));
    fm.operations.push(getOp('2'));
    fm.operations.push(getOp('3'));
    fm.operations.push(getOp('4'));
    fm.operations.push(getOp('5'));
    fm.operations.push(getOp('6'));
    fm.operations.push(getOp('7'));
    fm.operations.push(getOp('8'));
    fm.operations.push(getOp('9'));

    for (let i = 0; i < 1000; i += 1) {
        fm.runOps();
    }
    expect(fm.operations.length).toBe(0);

    const updateOp = getOp('1');
    updateOp.mode = 'UPDATE';
    updateOp.position = {
        x: 10,
        y: 12,
    };
    const deleteOp = getOp('2');
    deleteOp.mode = 'DELETE';
    deleteOp.completeCallback = () => {};

    fm.operations.push(updateOp);
    fm.operations.push(deleteOp);
    fm.operations.push(null);

    for (let i = 0; i < 1000; i += 1) {
        fm.runOps();
    }
    expect(fm.operations.length).toBe(1);
});

test('can handle message', async () => {
    const { fm } = getFm();
    fm.connect();
    await server.connected;

    server.send(JSON.stringify(fleetData));
});

test('can handle delete message', async () => {
    const { fm } = getFm();
    fm.connect();
    await server.connected;
    fm.groups = {};

    server.send(JSON.stringify(fleetData));
    fleetData[0].mode = 'DELETE';
    server.send(JSON.stringify(fleetData));
    fleetData[0].mode = 'UPDATE';
    fleetData[0].children.asdf.mode = 'UPDATE';
    fleetData[0].children.asdf2.mode = 'DELETE';
    server.send(JSON.stringify(fleetData));
});

test('can remove child by name', async () => {
    const { fm } = getFm();
    const sp = new FleetSprite();
    sp.name = 'asdf';
    fm.addChild(sp);

    fm.removeChildByName('asdf');
});

test('can zoom', async () => {
    const { fm } = getFm();

    fm.zoomFit();
    fm.zoomIn();
    fm.zoomOut();
});

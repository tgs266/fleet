import { render } from '@testing-library/react';
import React from 'react';
import FleetGroup, { FleetContainer } from './FleetGroup';
import FleetManager from './FleetManager';
import { BOX_MARGIN } from './helper';

const getFg = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const x = new FleetContainer(null);
    let fg = new FleetGroup('g', 'asdf');
    fg = new FleetGroup('g', 'asdf', { x: 0, y: 0 });
    fg.openPositions = [
        {
            x: 0,
            y: 100,
        },
        {
            x: BOX_MARGIN,
            y: 100,
        },
        {
            x: 10,
            y: 2,
        },
        {
            x: 3,
            y: 3,
        },
        {
            x: 1,
            y: 5,
        },
        {
            x: 1,
            y: 1,
        },
        {
            x: 56,
            y: 32,
        },
        {
            x: 30,
            y: 12,
        },
        {
            x: 135,
            y: 125242,
        },
        {
            x: 76,
            y: 23,
        },
        {
            x: 30,
            y: 12,
        },
    ];
    return fg;
};

test('can create', async () => {
    getFg();
});

test('can sort', async () => {
    const fg = getFg();
    fg.sortOpenPositions();
    expect(fg.openPositions[0].x).toBe(1);
    expect(fg.openPositions[0].y).toBe(1);
});

test('can get open position', async () => {
    const fg = getFg();
    expect(fg.findOpenPosition().x).toBe(0);
    expect(fg.findOpenPosition().y).toBe(100);
});

test('can get open position 2', async () => {
    const fg = getFg();
    fg.openPositions = [];
    expect(fg.findOpenPosition().x).toBe(30);
    expect(fg.findOpenPosition().y).toBe(0);
});

test('can calculate width', async () => {
    const fg = getFg();
    expect(fg.width).toBe(1495);
});

test('can cleanOpenPositions', async () => {
    const fg = getFg();
    fg.cleanOpenPositions();
});

test('can createNewOperation', async () => {
    const fg = getFg();
    const obj = fg.createNewOperation({
        meta: {
            name: 'asdf',
            namespace: 'asdf',
            uid: 'asdf',
            details: {},
        },
        dimension: 'pod',
        mode: 'new',
        ownerUID: 'g',
        status: {
            color: [0, 0, 0],
            reason: '',
            value: '',
        },
    });

    expect(obj.tint[0]).toBe(0);
    expect(obj.tint[1]).toBe(0);
    expect(obj.tint[2]).toBe(0);
    expect(obj.id).toBe('asdf');

    fg.getClearOps();
    fg.removeFromAllIds('asdf');
    fg.removeFromAllIds('asdf3asd');
});

test('can createUpdateOperation', async () => {
    const fg = getFg();
    const obj = fg.createUpdateOperation({
        meta: {
            name: 'asdf',
            namespace: 'asdf',
            uid: 'asdf',
            details: {},
        },
        dimension: 'pod',
        mode: 'new',
        ownerUID: 'g',
        status: {
            color: [0, 0, 0],
            reason: '',
            value: '',
        },
    });

    expect(obj.tint[0]).toBe(0);
    expect(obj.tint[1]).toBe(0);
    expect(obj.tint[2]).toBe(0);
    expect(obj.id).toBe('asdf');
});

test('can createDeleteOperation', async () => {
    const fg = getFg();
    const obj = fg.createDeleteOperation({
        meta: {
            name: 'asdf',
            namespace: 'asdf',
            uid: 'asdf',
            details: {},
        },
        dimension: 'pod',
        mode: 'new',
        ownerUID: 'g',
        status: {
            color: [0, 0, 0],
            reason: '',
            value: '',
        },
    });

    expect(obj.tint[0]).toBe(0);
    expect(obj.tint[1]).toBe(0);
    expect(obj.tint[2]).toBe(0);
    expect(obj.id).toBe('asdf');
    const ele = render(<div />).container as HTMLDivElement;
    const fm = new FleetManager(ele);
    obj.completeCallback(fm, { x: 0, y: 100 });
});

test('can consolidate', async () => {
    const fg = getFg();
    const ele = render(<div />).container as HTMLDivElement;
    const fm = new FleetManager(ele);
    fg.consolidate(fm);
    expect(fm.operations.length).toBe(1);
});

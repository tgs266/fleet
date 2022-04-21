import * as React from 'react';
import { render } from '@testing-library/react';
import { Point } from 'pixi.js-legacy';
import '@testing-library/jest-dom';
import WS from 'jest-websocket-mock';
import FleetManager from '../FleetManager';
import FleetGroup from '../FleetGroup';
import click from './click';
import { FleetSprite } from '../helper';
import hover from './hover';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = new WS('ws://localhost:9095/ws/v1/fleet');

const getFm = () => {
    const ele = render(<div id="fleet" />).container as HTMLDivElement;
    ele.style.width = '100px';
    ele.style.height = '100px';
    const fm = new FleetManager(ele);

    fm.connect();

    fm.groups = {
        g: new FleetGroup('g', 'g', { x: 1, y: 1 }),
    };

    fm.groups.g.allIds = ['asdf'];
    fm.groups.g.rowSize = 10;

    const child = new FleetSprite();
    child.name = 'asdf';
    child.setData({
        meta: {
            uid: 'asdf',
            namespace: 'asdf',
            name: 'asdf',
            details: {
                asdf: 'asdf',
            },
        },
        dimension: 'pod',
        status: {
            color: [0, 0, 0],
            reason: 'Running',
            value: 'asd',
        },
    });

    fm.addChild(child);

    return { fm, ele };
};

test('can handle click', async () => {
    const { fm } = getFm();
    fm.groupRegions = {
        g: {
            x: {
                start: 0,
                end: 100,
            },
            y: {
                start: 0,
                end: 100,
            },
        },
    };
    const point = new Point(45, 1);
    click(fm, { x: 45, y: 1 }, point);
});

test('can handle hover', async () => {
    const { fm } = getFm();
    fm.groupRegions = {
        g: {
            x: {
                start: 0,
                end: 100,
            },
            y: {
                start: 0,
                end: 100,
            },
        },
    };
    const point = new Point(45, 1);
    const fn = jest.fn();
    hover(fm, { x: 45, y: 1 }, fn, point);
    expect(fn).toHaveBeenCalled();
});

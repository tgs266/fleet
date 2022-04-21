import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import FleetPopover from './Popover';
import { FleetSprite } from './helper';

const getWrapper = (type: string) => {

    const child = new FleetSprite()
    child.data = {
        meta: {
            uid: "asdf",
            namespace: "asdf",
            name: "asdf",
            details: {
                "asdf": "asdf"
            },
        },
        dimension: type,
        status: {
            color: [0,0,0],
            reason: "Running",
            value: "asd"
        }
    }

    return render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="*" element={<FleetPopover type={type} child={child} />} />
        </Routes>
    </MemoryRouter>)
}

test('renders without crashing deployment', async () => {
    getWrapper("deployment")
});

test('renders without crashing pod', async () => {
    getWrapper("pod")
});

test('renders without crashing container', async () => {
    getWrapper("container")
});

test('renders without crashing other', async () => {
    getWrapper("other")
});
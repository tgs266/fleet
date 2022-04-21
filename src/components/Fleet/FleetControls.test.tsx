import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render,fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import Layout from '../../layouts/Layout';
import FleetControls from './FleetControls';
import FleetManager from './FleetManager';
import FleetGroup from './FleetGroup';
import { delay } from '../../testing/utils';

const getFm = () => {
    const ele = render(<div />).container as HTMLDivElement
    const fm = new FleetManager(ele)

    fm.groups = {
        "g": new FleetGroup("g", "asdf", {x: 1, y: 1})
    }

    return {fm, ele}
}

test('renders without crashing', async () => {
    const {fm} = getFm()
    const toggle = jest.fn()
    const wrapper = render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<FleetControls manager={fm} toggle={toggle} hovering="h" isOpen={false} />} />
            </Route>
        </Routes>
    </MemoryRouter>)

    fireEvent.click(wrapper.getByTestId("controls-open"))

});

test('save', async () => {
    const {fm} = getFm()
    const toggle = jest.fn()
    fm.setDim0 = jest.fn()
    fm.setDim1 = jest.fn()
    fm.connect = jest.fn()
    const wrapper = render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<FleetControls manager={fm} toggle={toggle} hovering="h" isOpen={false} />} />
            </Route>
        </Routes>
    </MemoryRouter>)

    await delay(100)

    fireEvent.click(wrapper.getByTestId("controls-open"))
    fireEvent.click(wrapper.getByTestId("save-btn"))
    expect(fm.setDim0).toHaveBeenCalled()
    expect(fm.setDim1).toHaveBeenCalled()
    expect(fm.connect).toHaveBeenCalled()

});
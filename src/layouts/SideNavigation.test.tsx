import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render,fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import SideNavigation from './SideNavigation';

test('renders without crashing', async () => {
    render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="*" element={<SideNavigation />} />
        </Routes>
    </MemoryRouter>)
});



test('can navigate to home', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="*" element={<SideNavigation />} />
            </Routes>
        </MemoryRouter>
    );
    fireEvent(wrapper.container.querySelector('#Home'), new MouseEvent("click"))
    expect(window.location.pathname).toBe("/")
})
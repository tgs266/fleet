import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from './Sidebar';
import Layout from './Layout';

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Sidebar />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

test('can navigate to home', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Sidebar />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    fireEvent(wrapper.container.querySelector('#home'), new MouseEvent('click'));
    expect(window.location.pathname).toBe('/');
});

test('can open drop', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/deployments']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="*" element={<Sidebar />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    fireEvent(wrapper.container.querySelector('#networking'), new MouseEvent('click'));
    fireEvent(wrapper.container.querySelector('#services'), new MouseEvent('click'));
});

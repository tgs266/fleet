import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import FleetView from './FleetView';
import Layout from '../../layouts/Layout';

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<FleetView />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

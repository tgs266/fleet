import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import GitControlBar from './GitControlBar';

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="*" element={<GitControlBar />} />
            </Routes>
        </MemoryRouter>
    );
});

import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render} from '@testing-library/react'
import '@testing-library/jest-dom'
import App from './App';

test('renders without crashing', async () => {
    render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="*" element={<App />} />
        </Routes>
    </MemoryRouter>)
});

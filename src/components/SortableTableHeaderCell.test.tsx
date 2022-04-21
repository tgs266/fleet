import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Alignment } from '@blueprintjs/core';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import SortableTableHeaderCell from './SortableTableHeaderCell';

test('renders without crashing left', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="*"
                    element={
                        <SortableTableHeaderCell
                            sort={{
                                sortableId: 'name',
                                ascending: false,
                            }}
                            sortableId="name"
                            style={{ width: '100%' }}
                            alignment={Alignment.LEFT}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    );
});

test('renders without crashing right', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="*"
                    element={
                        <SortableTableHeaderCell
                            sort={{
                                sortableId: 'name',
                                ascending: false,
                            }}
                            sortableId="name"
                            style={{ width: '100%' }}
                            alignment={Alignment.RIGHT}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    );
});

test('renders without crashing center', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="*"
                    element={
                        <SortableTableHeaderCell
                            sort={{
                                sortableId: 'name',
                                ascending: false,
                            }}
                            sortableId="name"
                            style={{ width: '100%' }}
                            alignment={Alignment.CENTER}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    );
});

test('renders without crashing no style', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route
                    path="*"
                    element={
                        <SortableTableHeaderCell
                            sort={{
                                sortableId: 'name',
                                ascending: true,
                            }}
                            sortableId="name"
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    );
});

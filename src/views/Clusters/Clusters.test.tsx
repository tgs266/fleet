import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Layout from '../../layouts/Layout';
import Clusters from './Clusters';
import Electron from '../../services/electron.service';
import { delay } from '../../testing/utils';

const server = setupServer(
    rest.get(`http://localhost:9095/api/v1/electron/clusters`, (req, res, ctx) =>
        res(
            ctx.json([
                {
                    name: 'asdf',
                    source: 'asdf',
                    isConnected: false,
                    port: '0',
                },
            ])
        )
    ),
    rest.get(`http://localhost:9095/api/v1/electron/current`, (req, res, ctx) => {
        res(ctx.json(null));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing no override', async () => {
    await act(() => {
        render(
            <MemoryRouter initialEntries={['/c']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="c" element={<Clusters />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    });
    await delay(500);
});

test('renders without crashing', async () => {
    Electron.override = true;
    await act(() => {
        render(
            <MemoryRouter initialEntries={['/c']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="c" element={<Clusters />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    });
    await delay(500);
});

test('renders without crashing no clusters', async () => {
    Electron.override = true;
    await server.use(
        rest.get(`http://localhost:9095/api/v1/electron/clusters`, (req, res, ctx) =>
            res(ctx.json([]))
        )
    );
    await act(() => {
        render(
            <MemoryRouter initialEntries={['/c']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="c" element={<Clusters />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    });
    await delay(500);
});

test('renders with cluster', async () => {
    Electron.override = true;
    await server.use(
        rest.get(`http://localhost:9095/api/v1/electron/current`, (req, res, ctx) => {
            res(
                ctx.json({
                    name: 'asdf',
                    source: 'asdf',
                    isConnected: true,
                    port: '0',
                })
            );
        }),
        rest.get(`http://localhost:9095/api/v1/electron/clusters`, (req, res, ctx) =>
            res(
                ctx.json([
                    {
                        name: 'asdf',
                        source: 'asdf',
                        isConnected: true,
                        port: '0',
                    },
                ])
            )
        )
    );
    await act(() => {
        render(
            <MemoryRouter initialEntries={['/c']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="c" element={<Clusters />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    });
    await delay(500);
});

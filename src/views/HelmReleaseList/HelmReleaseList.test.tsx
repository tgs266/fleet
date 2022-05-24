import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import Helm from '../../services/helm.service';
import { delay, getNs } from '../../testing/utils';
import HelmReleaseList from './HelmReleaseList';

const server = setupServer(
    getNs(),
    rest.get(`${Helm.base}/releases`, (req, res, ctx) =>
        res(
            ctx.json({
                items: [
                    {
                        name: 'string',
                        namespace: 'string',
                        resources: [
                            {
                                kind: 'Service',
                                metadata: {
                                    name: 'asdf',
                                    namespace: 'asdf',
                                },
                            },
                        ],
                        info: {
                            status: 'deployed',
                            notes: 'notes!',
                        },
                        chart: {
                            metadata: {
                                name: 'string',
                                version: 'string',
                                appVersion: 'string',
                                description: 'string',
                                icon: 'string',
                                repo: 'string',
                                readme: 'string',
                                deprecated: false,
                                keywords: ['1', '2'],
                                home: 'string',
                                values: 'string',
                                maintainers: [{ name: 'string', email: 'string' }],
                            },
                        },
                    },
                ],
            })
        )
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<HelmReleaseList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await delay(500);
});

test('renders without crashing 2', async () => {
    await server.use(
        rest.get(`${Helm.base}/releases`, (req, res, ctx) =>
            res(
                ctx.json({
                    items: [
                        {
                            name: 'string',
                            namespace: 'string',
                            resources: [
                                {
                                    kind: 'Service',
                                    metadata: {
                                        name: 'asdf',
                                        namespace: 'asdf',
                                    },
                                },
                            ],
                            info: {
                                status: 'no',
                                notes: 'notes!',
                            },
                            chart: {
                                metadata: {
                                    name: 'string',
                                    version: 'string',
                                    appVersion: 'string',
                                    description: 'string',
                                    icon: 'string',
                                    repo: 'string',
                                    readme: 'string',
                                    deprecated: true,
                                    keywords: ['1', '2'],
                                    home: 'string',
                                    values: 'string',
                                    maintainers: [{ name: 'string', email: 'string' }],
                                },
                            },
                        },
                    ],
                })
            )
        )
    );

    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<HelmReleaseList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await delay(500);
});

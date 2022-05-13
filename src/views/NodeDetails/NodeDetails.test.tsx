import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { generateNode } from '../../testing/type_mocks';
import NodeDetails from './NodeDetails';
import Nodes from '../../services/k8/node.service';

const server = setupServer(
    rest.get(`${Nodes.base}/test`, (req, res, ctx) => res(ctx.json(generateNode()))),
    rest.post('/api/v1/metrics/*', (req, res, ctx) =>
        res(
            ctx.json({
                cpuUsage: {
                    status: 'success',
                    error: '',
                    errorType: '',
                    warnings: [],
                    data: {
                        resultType: 'asdf',
                        result: [
                            {
                                metric: {},
                                values: [
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                ],
                            },
                        ],
                    },
                },
            })
        )
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/nodes/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="nodes/:nodeName" element={<NodeDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

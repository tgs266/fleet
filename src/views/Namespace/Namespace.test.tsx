import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Layout from '../../layouts/Layout';
import { delay, getNs } from '../../testing/utils';
import Namespace from './Namespace';
import Deployments from '../../services/k8/deployment.service';
import { generateDeployment, generatePod, generateServiceMeta } from '../../testing/type_mocks';
import Pods from '../../services/k8/pod.service';
import Services from '../../services/k8/service.service';
import Namespaces from '../../services/k8/namespace.service';
import SSE from '../../services/sse.service';

const server = setupServer(
    rest.get(`${Deployments.base}/*`, (req, res, ctx) =>
        res(
            ctx.json([
                generateDeployment('test'),
                generateDeployment('test2'),
                generateDeployment('test3'),
            ])
        )
    ),
    rest.get(`${Pods.base}/test`, (req, res, ctx) =>
        res(ctx.json([generatePod('test'), generatePod('test2'), generatePod('test3')]))
    ),
    rest.get(`${Services.base}/test`, (req, res, ctx) =>
        res(
            ctx.json([
                generateServiceMeta('test'),
                generateServiceMeta('test2'),
                generateServiceMeta('test3'),
            ])
        )
    ),
    rest.get(`${Namespaces.base}/test`, (req, res, ctx) =>
        res(
            ctx.json({
                name: 'test',
                uid: 'test',
                createdAt: 245325,
                labels: {},
                annotations: {},
            })
        )
    ),
    getNs()
);

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call({
        name: 'test',
        uid: 'test',
        createdAt: 245325,
        labels: {},
        annotations: {},
    });
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    await act(() => {
        render(
            <MemoryRouter initialEntries={['/ns/test']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="ns/:namespace" element={<Namespace />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    });
    await delay(500);
});

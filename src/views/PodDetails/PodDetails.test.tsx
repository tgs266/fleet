import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import PodDetails from './PodDetails';
import Layout from '../../layouts/Layout';
import Pods from '../../services/k8/pod.service';
import { Pod } from '../../models/pod.model';
import { delay } from '../../testing/utils';
import { generatePod } from '../../testing/type_mocks';
import SSE from '../../services/sse.service';

const generatePodWithAnnotationAndLabels = (name: string): Pod => {
    const pod = generatePod(name);
    pod.annotations = {
        adsf: 'asdf',
    };
    pod.labels = {
        adsf: 'asdf',
    };
    return pod;
};

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call(generatePod('test'));
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

const server = setupServer(
    rest.get(`${Pods.base}/test/test`, (req, res, ctx) => res(ctx.json(generatePod('test')))),
    rest.get('/api/v1/raw/pods/test/test', (req, res, ctx) => res(ctx.json(generatePod('test')))),
    rest.delete('/api/v1/pods/test/test', (req, res, ctx) => res(ctx.status(201))),
    rest.put('/api/v1/raw/pods/test/test', (req, res, ctx) => res(ctx.json('asdf'))),
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
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="pods/:namespace/:podName" element={<PodDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing resource information', async () => {
    const p = generatePodWithAnnotationAndLabels('test');
    p.resources.cpuLimit = 10;
    p.resources.cpuRequests = 10;
    p.resources.cpuUsage = 1;
    p.resources.cpuUsageLimitFraction = 0.1;
    p.resources.cpuUsageRequestsFraction = 0.1;

    p.resources.memoryLimit = 10;
    p.resources.memoryRequests = 10;
    p.resources.memoryUsage = 1;
    p.resources.memoryUsageLimitFraction = 0.1;
    p.resources.memoryUsageRequestsFraction = 0.1;

    await server.use(rest.get(`${Pods.base}/test/test`, (req, res, ctx) => res(ctx.json(p))));
    const wrapper = render(
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="pods/:namespace/:podName" element={<PodDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing with labels and annotations', async () => {
    await server.use(
        rest.get(`${Pods.base}/test/test`, (req, res, ctx) =>
            res(ctx.json(generatePodWithAnnotationAndLabels('test')))
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="pods/:namespace/:podName" element={<PodDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('can refresh', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="pods/:namespace/:podName" element={<PodDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    await server.use(
        rest.get(`${Pods.base}/test/test`, (req, res, ctx) => res(ctx.json(generatePod('test1'))))
    );

    fireEvent.click(wrapper.getByTestId('refresh'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test1'));
});

test('can switch tabs', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="pods/:namespace/:podName" element={<PodDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    fireEvent.click(wrapper.getByTestId('tab-Metrics'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

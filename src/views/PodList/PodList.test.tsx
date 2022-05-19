import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import PodList from './PodList';
import Layout from '../../layouts/Layout';
import Pods from '../../services/k8/pod.service';
import { PodMeta } from '../../models/pod.model';
import { delay, getNs } from '../../testing/utils';

const generatePod = (): PodMeta => ({
    namespace: 'test',
    restarts: Math.floor(Math.random() * 10),
    nodeName: 'test',
    status: {
        reason: 'because',
        genericStatus: 'status',
    },
    uid: Math.floor(Math.random() * 10000).toString(),
    name: Math.floor(Math.random() * 10000).toString(),
    createdAt: Math.floor(Math.random() * 1000000),
    labels: {},
    annotations: {},
});

const server = setupServer(
    getNs(),
    rest.get(`${Pods.base}/*`, (req, res, ctx) => {
        const count = 20;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generatePod());
        }
        return res(
            ctx.json({
                items,
                total: items.length,
            })
        );
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<PodList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

test('can go forwards and backwards in table', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<PodList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await delay(1000).then(async () => {
        const forwardBtn = wrapper.getByTestId('next-page');
        fireEvent.click(forwardBtn);
        await delay(1000).then(() => {
            const backwardBtn = wrapper.getByTestId('prev-page');
            fireEvent.click(backwardBtn);
        });
    });
});

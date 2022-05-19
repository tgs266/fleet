import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { generateReplicaSet } from '../../testing/type_mocks';
import ReplicaSetList from './ReplicaSetList';
import ReplicaSetTable from './ReplicaSetTable';
import { delay, getNs } from '../../testing/utils';
import Auth from '../../services/auth.service';
import ReplicaSets from '../../services/k8/replicaset.service';

const server = setupServer(
    getNs(),
    rest.get(`${Auth.base}/cani`, (req, res, ctx) => res(ctx.json({ allowed: true }))),
    rest.get(`${ReplicaSets.base}/*`, (req, res, ctx) => {
        const count = 50;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generateReplicaSet(`${i}-asdf`));
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
                    <Route path="" element={<ReplicaSetList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

test('render 2', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<ReplicaSetTable namespace={null} />} />
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
                    <Route path="" element={<ReplicaSetTable />} />
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

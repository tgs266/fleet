import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { ClusterRoleMeta } from '../../models/clusterrole.model';
import ClusterRoleList from './ClusterRoleList';
import ClusterRoles from '../../services/k8/clusterrole.service';

const generateClusterRole = (name: string): ClusterRoleMeta => ({
    name,
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
});

const server = setupServer(
    rest.get(`${ClusterRoles.base}/*`, (req, res, ctx) => {
        const count = 20;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generateClusterRole(`${i}-asdf`));
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
                    <Route path="" element={<ClusterRoleList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await delay(500);
});

test('can go forwards and backwards in table', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<ClusterRoleList />} />
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

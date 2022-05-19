import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { delay, getNs } from '../../testing/utils';
import { RoleBindingMeta } from '../../models/role.model';
import RoleBindings from '../../services/k8/rolebinding.service';
import RoleBindingList from './RoleBindingList';
import ClusterRoleBindings from '../../services/k8/clusterrolebinding.service';
import { generateClusterRoleBinding } from '../../testing/type_mocks';

const generateRoleBinding = (name: string): RoleBindingMeta => ({
    name,
    namespace: 'asdf',
    roleName: 'test',
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
});

const server = setupServer(
    getNs(),
    rest.get(`${RoleBindings.base}/*`, (req, res, ctx) => {
        const count = 50;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generateRoleBinding(`${i}-asdf`));
        }
        return res(
            ctx.json({
                items,
                total: items.length,
            })
        );
    }),
    rest.get(`${ClusterRoleBindings.base}/*`, (req, res, ctx) => {
        const count = 50;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generateClusterRoleBinding(`${i}-asdf`));
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
                    <Route path="" element={<RoleBindingList />} />
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
                    <Route path="" element={<RoleBindingList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await delay(1000).then(async () => {
        const forwardBtn = wrapper.getAllByTestId('next-page')[0];
        fireEvent.click(forwardBtn);
        await delay(1000).then(() => {
            const backwardBtn = wrapper.getAllByTestId('prev-page')[0];
            fireEvent.click(backwardBtn);
        });
    });
});

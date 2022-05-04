import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../layouts/Layout';
import { ClusterRoleBindingMeta } from '../models/clusterrole.model';
import K8 from '../services/k8.service';
import ClusterRoleBindings from '../services/k8/clusterrolebinding.service';
import { generateClusterRoleBinding } from '../testing/type_mocks';
import ResourceTableView from './ResourceTableView';
import { delay } from '../testing/utils';

const server = setupServer(
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

class RTV extends ResourceTableView<unknown, ClusterRoleBindingMeta> {
    itemsFcn = K8.clusterRoleBindings.getClusterRoleBindings;
}

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<RTV />} />
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
                    <Route path="" element={<RTV />} />
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

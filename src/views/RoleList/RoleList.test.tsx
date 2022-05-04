import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import Roles from '../../services/k8/role.service';
import RoleList from './RoleList';
import ClusterRoles from '../../services/k8/clusterrole.service';
import { ClusterRoleMeta } from '../../models/clusterrole.model';
import { generateRole } from '../../testing/type_mocks';

const generateClusterRole = (name: string): ClusterRoleMeta => ({
    name,
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
});

const server = setupServer(
    rest.get(`${Roles.base}/*`, (req, res, ctx) => {
        const count = 50;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generateRole(`${i}-asdf`));
        }
        return res(
            ctx.json({
                items,
                total: items.length,
            })
        );
    }),
    rest.get(`${ClusterRoles.base}`, (req, res, ctx) => {
        const count = 50;
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
                    <Route path="" element={<RoleList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await delay(500);
});

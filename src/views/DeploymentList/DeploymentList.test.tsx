import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import Deployments from '../../services/k8/deployment.service';
import DeploymentList from './DeploymentList';
import { generateDeployment } from '../../testing/type_mocks';
import { delay, getNs } from '../../testing/utils';

const server = setupServer(
    getNs(),
    rest.get(`${Deployments.base}/*`, (req, res, ctx) => {
        const count = 50;
        const items = [];
        for (let i = 0; i < count; i += 1) {
            items.push(generateDeployment('asdf'));
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
                    <Route path="" element={<DeploymentList />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await delay(500);
});

import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import ServiceAccountDetails from './ServiceAccountDetails';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { generateServiceAccount } from '../../testing/type_mocks';
import ServiceAccounts from '../../services/k8/serviceaccount.service';

const generateServiceAccountWithoutLabelsAndAnnotations = (name: string) => {
    const role = generateServiceAccount(name);
    role.annotations = {};
    role.labels = {};
    return role;
};

const server = setupServer(
    rest.get(`${ServiceAccounts.base}/test/test`, (req, res, ctx) =>
        res(ctx.json(generateServiceAccount('test')))
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/serviceAccounts/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="serviceAccounts/:namespace/:serviceAccountName"
                        element={<ServiceAccountDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing without labels and annotations', async () => {
    await server.use(
        rest.get(`${ServiceAccounts.base}/test/test`, (req, res, ctx) =>
            res(ctx.json(generateServiceAccountWithoutLabelsAndAnnotations('test')))
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/serviceAccounts/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="serviceAccounts/:namespace/:serviceAccountName"
                        element={<ServiceAccountDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('can refresh', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/serviceAccounts/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="serviceAccounts/:namespace/:serviceAccountName"
                        element={<ServiceAccountDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    await server.use(
        rest.get(`${ServiceAccounts.base}/test/test`, (req, res, ctx) =>
            res(ctx.json(generateServiceAccount('test1')))
        )
    );

    fireEvent.click(wrapper.getByTestId('refresh'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test1'));
});

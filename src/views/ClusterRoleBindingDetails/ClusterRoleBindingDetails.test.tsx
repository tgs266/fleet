import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { generateClusterRoleBinding, generateRoleBinding } from '../../testing/type_mocks';
import ClusterRoleBindings from '../../services/k8/clusterrolebinding.service';
import ClusterRoleBindingDetails from './ClusterRoleBindingDetails';

const generateClusterRoleBindingWithoutLabelsAndAnnotations = (name: string) => {
    const role = generateClusterRoleBinding(name);
    role.annotations = {};
    role.labels = {};
    return role;
};

const server = setupServer(
    rest.get(`${ClusterRoleBindings.base}/test`, (req, res, ctx) =>
        res(ctx.json(generateRoleBinding('test')))
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/clusterrolebindings/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="clusterrolebindings/:clusterRoleBindingName"
                        element={<ClusterRoleBindingDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing without labels and annotations', async () => {
    await server.use(
        rest.get(`${ClusterRoleBindings.base}/test`, (req, res, ctx) =>
            res(ctx.json(generateClusterRoleBindingWithoutLabelsAndAnnotations('test')))
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/clusterrolebindings/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="clusterrolebindings/:clusterRoleBindingName"
                        element={<ClusterRoleBindingDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('can refresh', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/clusterrolebindings/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="clusterrolebindings/:clusterRoleBindingName"
                        element={<ClusterRoleBindingDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    await server.use(
        rest.get(`${ClusterRoleBindings.base}/test`, (req, res, ctx) =>
            res(ctx.json(generateRoleBinding('test1')))
        )
    );

    fireEvent.click(wrapper.getByTestId('refresh'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test1'));
});

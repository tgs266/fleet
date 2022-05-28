import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { generateClusterRole } from '../../testing/type_mocks';
import ClusterRoles from '../../services/k8/clusterrole.service';
import ClusterRoleDetails from './ClusterRoleDetails';
import SSE from '../../services/sse.service';

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call(generateClusterRole('test'));
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

const generateClusterRoleWithoutLabelsAndAnnotations = (name: string) => {
    const role = generateClusterRole(name);
    role.annotations = {};
    role.labels = {};
    return role;
};

const server = setupServer(
    rest.get(`${ClusterRoles.base}/test`, (req, res, ctx) =>
        res(ctx.json(generateClusterRole('test')))
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/clusterroles/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="clusterroles/:roleName" element={<ClusterRoleDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing without labels and annotations', async () => {
    await server.use(
        rest.get(`${ClusterRoles.base}/test`, (req, res, ctx) =>
            res(ctx.json(generateClusterRoleWithoutLabelsAndAnnotations('test')))
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/clusterroles/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="clusterroles/:roleName" element={<ClusterRoleDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('can refresh', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/clusterroles/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="clusterroles/:roleName" element={<ClusterRoleDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    await server.use(
        rest.get(`${ClusterRoles.base}/test`, (req, res, ctx) =>
            res(ctx.json(generateClusterRole('test1')))
        )
    );

    fireEvent.click(wrapper.getByTestId('refresh'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test1'));
});

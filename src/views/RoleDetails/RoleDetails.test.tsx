import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import RoleDetails from './RoleDetails';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { generateRole } from '../../testing/type_mocks';
import Roles from '../../services/k8/role.service';
import SSE from '../../services/sse.service';

const generateRoleWithoutLabelsAndAnnotations = (name: string) => {
    const role = generateRole(name);
    role.annotations = {};
    role.labels = {};
    return role;
};

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call(generateRole('test'));
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

const server = setupServer(
    rest.get(`${Roles.base}/test/test`, (req, res, ctx) => res(ctx.json(generateRole('test'))))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/roles/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="roles/:namespace/:roleName" element={<RoleDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing without labels and annotations', async () => {
    await server.use(
        rest.get(`${Roles.base}/test/test`, (req, res, ctx) =>
            res(ctx.json(generateRoleWithoutLabelsAndAnnotations('test')))
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/roles/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="roles/:namespace/:roleName" element={<RoleDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('can refresh', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/roles/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="roles/:namespace/:roleName" element={<RoleDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    await server.use(
        rest.get(`${Roles.base}/test/test`, (req, res, ctx) => res(ctx.json(generateRole('test1'))))
    );

    fireEvent.click(wrapper.getByTestId('refresh'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test1'));
});

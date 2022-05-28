import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { generateRoleBinding } from '../../testing/type_mocks';
import RoleBindings from '../../services/k8/rolebinding.service';
import RoleBindingDetails from './RoleBindingDetails';
import SSE from '../../services/sse.service';

const generateRoleBindingWithoutLabelsAndAnnotations = (name: string) => {
    const role = generateRoleBinding(name);
    role.annotations = {};
    role.labels = {};
    return role;
};

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call(generateRoleBinding('test'));
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

const server = setupServer(
    rest.get(`${RoleBindings.base}/test/test`, (req, res, ctx) =>
        res(ctx.json(generateRoleBinding('test')))
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/rolebindings/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="rolebindings/:namespace/:roleBindingName"
                        element={<RoleBindingDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('renders without crashing without labels and annotations', async () => {
    await server.use(
        rest.get(`${RoleBindings.base}/test/test`, (req, res, ctx) =>
            res(ctx.json(generateRoleBindingWithoutLabelsAndAnnotations('test')))
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/rolebindings/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="rolebindings/:namespace/:roleBindingName"
                        element={<RoleBindingDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

test('can refresh', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/rolebindings/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="rolebindings/:namespace/:roleBindingName"
                        element={<RoleBindingDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));

    await server.use(
        rest.get(`${RoleBindings.base}/test/test`, (req, res, ctx) =>
            res(ctx.json(generateRoleBinding('test1')))
        )
    );

    fireEvent.click(wrapper.getByTestId('refresh'));
    await delay(500);
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test1'));
});

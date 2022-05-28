import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import ServiceAccountDetails from './ServiceAccountDetails';
import Layout from '../../layouts/Layout';
import { delay } from '../../testing/utils';
import { generateServiceAccount } from '../../testing/type_mocks';
import ServiceAccounts from '../../services/k8/serviceaccount.service';
import { ClusterRoleBinding } from '../../models/clusterrole.model';
import { RoleBinding } from '../../models/role.model';
import ClusterRoleBindings from '../../services/k8/clusterrolebinding.service';
import RoleBindings from '../../services/k8/rolebinding.service';
import { getText } from './BindDialogShared';
import SSE from '../../services/sse.service';

const generateServiceAccountWithoutLabelsAndAnnotations = (name: string) => {
    const role = generateServiceAccount(name);
    role.annotations = {};
    role.labels = {};
    return role;
};

const generateClusterRoleBinding = (name: string): ClusterRoleBinding => ({
    name,
    roleName: 'test',
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    subjects: [
        {
            kind: 'asdf',
            name: 'asdf',
            namespace: 'asdf',
            apiGroup: 'asdf',
        },
    ],
});

const generateRoleBinding = (name: string): RoleBinding => ({
    name,
    roleName: 'test',
    namespace: 'asdf',
    uid: name,
    createdAt: 0,
    labels: { adsf: 'asdf' },
    annotations: { asdf: 'asdf' },
    subjects: [
        {
            kind: 'asdf',
            name: 'asdf',
            namespace: 'asdf',
            apiGroup: 'asdf',
        },
    ],
});

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call(generateServiceAccount('test'));
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

const server = setupServer(
    rest.get(`${ServiceAccounts.base}/test/test`, (req, res, ctx) =>
        res(ctx.json(generateServiceAccount('test')))
    ),
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
    }),
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
    rest.put(`${ServiceAccounts.base}/test/test/remove/role`, (req, res, ctx) =>
        res(ctx.status(200))
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

test('open role bind dialog', async () => {
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
    act(() => {
        fireEvent.click(wrapper.queryByTestId('open-role-binding'));
    });

    expect(document.getElementById('Bind To Role')).toBeInTheDocument();
});

test('open cluster role bind dialog', async () => {
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
    act(() => {
        fireEvent.click(wrapper.queryByTestId('open-cluster-role-binding'));
    });

    expect(document.getElementById('Bind To Cluster Role')).toBeInTheDocument();
});

test('remove role binding', async () => {
    await act(async () => {
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
        fireEvent.click(wrapper.queryByTestId('remove-role-binding'));
        await delay(1000);
    });
});

test('get text', () => {
    const data: RoleBinding = generateRoleBinding('asdf');
    data.namespace = 'asdf';
    expect(getText(data)).toBe('asdf/asdf');
    data.namespace = null;
    expect(getText(data)).toBe('asdf');
});

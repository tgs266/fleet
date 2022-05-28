import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { generateReplicaSet } from '../../testing/type_mocks';
import ReplicaSets from '../../services/k8/replicaset.service';
import ReplicaSetDetails from './ReplicaSetDetails';
import SSE from '../../services/sse.service';

const server = setupServer(
    rest.get(`${ReplicaSets.base}/test/test`, (req, res, ctx) =>
        res(ctx.json(generateReplicaSet('test')))
    )
);

jest.mock('../../services/sse.service');
const mockSubscribe = jest.fn((call: (input: any) => void) => {
    call(generateReplicaSet('test'));
    return { close: () => {} };
});
(SSE as any).mockImplementation(() => ({ subscribe: mockSubscribe }));

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/replicasets/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="replicasets/:namespace/:replicaSetName"
                        element={<ReplicaSetDetails />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

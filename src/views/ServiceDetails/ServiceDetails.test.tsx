import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../../layouts/Layout';
import { generatePod } from '../../testing/type_mocks';
import Services from '../../services/k8/service.service';
import ServiceDetails from './ServiceDetails';
import { Service } from '../../models/service.model';

const generateService = (name: string): Service => ({
    selector: { asdf: 'asdf' },
    pods: [generatePod('asdf')],
    clusterIp: 'asdf',
    name,
    namespace: 'test',
    uid: 'asdf',
    createdAt: 0,
    annotations: { asdf: 'asdf' },
    labels: { asdf: 'asdf' },
    type: 't',
    ports: [
        {
            name: '1',
            port: 90,
            protocol: 'UDP',
            appProtocol: 'asdf',
            targetPort: 90,
            nodePort: 3,
        },
    ],
    endpoints: [
        {
            host: 'asdf',
            ready: 'ready',
            nodeName: 'asdf',
            ports: [
                {
                    name: '1',
                    port: 90,
                    protocol: 'UDP',
                    appProtocol: 'asdf',
                },
            ],
        },
    ],
});

const server = setupServer(
    rest.get(`${Services.base}/test/test`, (req, res, ctx) =>
        res(ctx.json(generateService('test')))
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/services/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="services/:namespace/:serviceName" element={<ServiceDetails />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );
    await waitFor(() => expect(wrapper.queryByTestId('infocard-title').innerHTML).toBe('test'));
});

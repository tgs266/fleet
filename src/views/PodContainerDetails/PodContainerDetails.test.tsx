import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render,waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import PodContainerDetails from './PodContainerDetails';
import Layout from '../../layouts/Layout';
import Containers from '../../services/k8/container.service';
import { Container } from '../../models/container.model';
import { generateContainer } from '../../testing/type_mocks';


const generateContainerNoPorts = (name: string): Container => {
    const container = generateContainer(name, "Terminated")
    container.ports = []
    return container
}

const generateContainerNoEnvs = (name: string): Container => {
    const container = generateContainer(name, "Waiting")
    container.envVars = []
    return container
}

const server = setupServer(
    rest.get(`${Containers.base}/pods/test/test/containers/container`, (req, res, ctx) => res(ctx.json(generateContainer("container")))),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders without crashing', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test/containers/container']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="pods/:namespace/:podName/containers/:containerName" element={<PodContainerDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("container"))
});

test('renders without ports', async () => {
    server.use(
        rest.get(`${Containers.base}/pods/test/test/containers/container`, (req, res, ctx) => res(ctx.json(generateContainerNoPorts("container")))),
    )
    const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test/containers/container']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="pods/:namespace/:podName/containers/:containerName" element={<PodContainerDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("container"))
});

test('renders without envs', async () => {
    server.use(
        rest.get(`${Containers.base}/pods/test/test/containers/container`, (req, res, ctx) => res(ctx.json(generateContainerNoEnvs("container")))),
    )
    const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test/containers/container']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="pods/:namespace/:podName/containers/:containerName" element={<PodContainerDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("container"))
});

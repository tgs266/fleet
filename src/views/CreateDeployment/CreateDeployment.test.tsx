import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {render,waitFor,fireEvent} from '@testing-library/react'
import '@testing-library/jest-dom'
import Layout from '../../layouts/Layout';
import CreateDeployment from './CreateDeployment';
import Deployments from '../../services/k8/deployment.service';

const server = setupServer(
    rest.post(`${Deployments.base}/`, (req, res, ctx) => res(ctx.status(201))),
    rest.get(`api/v1/images/`, (req, res, ctx) => res(ctx.json([
        {
            name: "asdf",
            tag: "asdf"
        }
    ]))),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders without crashing', async () => {
    render(<MemoryRouter initialEntries={['/create-deployment']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="create-deployment" element={<CreateDeployment />} />
            </Route>
        </Routes>
    </MemoryRouter>)
});

test('can fill in data', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/create-deployment']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="create-deployment" element={<CreateDeployment />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("name-input")).toBeInTheDocument())
    fireEvent.change(wrapper.queryByTestId("name-input"), {target: {value: 'test-name'}})
    fireEvent.change(wrapper.queryByTestId("namespace-input"), {target: {value: 'test-namespace'}})
    fireEvent.click(wrapper.queryByTestId("add-new-row"))
    fireEvent.click(wrapper.queryByTestId("save-btn"))
});

test('can handle data errors invalid name', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/create-deployment']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="create-deployment" element={<CreateDeployment />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("name-input")).toBeInTheDocument())
    fireEvent.change(wrapper.queryByTestId("name-input"), {target: {value: 'test name'}})
    fireEvent.change(wrapper.queryByTestId("namespace-input"), {target: {value: 'test-namespace'}})
    fireEvent.click(wrapper.queryByTestId("add-new-row"))
    fireEvent.click(wrapper.queryByTestId("save-btn"))
});

test('can handle data errors no name', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/create-deployment']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="create-deployment" element={<CreateDeployment />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("name-input")).toBeInTheDocument())
    fireEvent.change(wrapper.queryByTestId("namespace-input"), {target: {value: 'test-namespace'}})
    fireEvent.click(wrapper.queryByTestId("add-new-row"))
    fireEvent.click(wrapper.queryByTestId("save-btn"))
});

test('can handle data errors no namespace', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/create-deployment']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="create-deployment" element={<CreateDeployment />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("name-input")).toBeInTheDocument())
    fireEvent.change(wrapper.queryByTestId("name-input"), {target: {value: 'test-name'}})
    fireEvent.click(wrapper.queryByTestId("add-new-row"))
    fireEvent.click(wrapper.queryByTestId("save-btn"))
});

test('can handle data errors no specs', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/create-deployment']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="create-deployment" element={<CreateDeployment />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("name-input")).toBeInTheDocument())
    fireEvent.change(wrapper.queryByTestId("name-input"), {target: {value: 'test-name'}})
    fireEvent.change(wrapper.queryByTestId("namespace-input"), {target: {value: 'test-namespace'}})
    fireEvent.click(wrapper.queryByTestId("save-btn"))
});

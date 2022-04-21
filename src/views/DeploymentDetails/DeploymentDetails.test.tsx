import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render,waitFor,fireEvent} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import DeploymentDetails from './DeploymentDetails';
import Layout from '../../layouts/Layout';
import {  generateDeployment } from '../../testing/type_mocks';
import Deployments from '../../services/k8/deployment.service';
import { delay } from '../../testing/utils';

const server = setupServer(
    rest.get(`${Deployments.base}/test/test`, (req, res, ctx) => res(ctx.json(generateDeployment("test")))),
    rest.delete(`${Deployments.base}/test/test`, (req, res, ctx) => res(ctx.status(201))),
    rest.put(`${Deployments.base}/test/test/scale`, (req, res, ctx) => res(ctx.status(201))),
    rest.get(`/api/v1/raw/deployments/test/test`, (req, res, ctx) => res(ctx.json(generateDeployment("test")))),
    rest.put(`/api/v1/raw/deployments/test/test`, (req, res, ctx) => res(ctx.status(201))),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

const getWrapper = async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/deployments/test/test']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="deployments/:namespace/:deployment" element={<DeploymentDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))
    return wrapper
}

test('renders without crashing', async () => {
    await getWrapper()
});

test('can refresh', async () => {
    const wrapper = await getWrapper()

    await server.use(
        rest.get(`${Deployments.base}/test/test`, (req, res, ctx) => res(ctx.json(generateDeployment("test1")))
    ))

    fireEvent.click(wrapper.getByTestId("refresh"))
    await delay(500)
    await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test1"))
});


test('can toggle edit dialog', async () => {
    const wrapper = await getWrapper()

    fireEvent.click(wrapper.getByTestId("edit"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("edit-dialog")).toBeInTheDocument())
});

test('can toggle delete dialog', async () => {
    await getWrapper()

    fireEvent.click(document.getElementById("top-menu-more"))
    fireEvent.click(document.getElementById("delete-btn"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("delete-dialog")).toBeInTheDocument())
});

test('can toggle scale dialog', async () => {
    const wrapper = await getWrapper()

    fireEvent.click(wrapper.getByTestId("scale"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("scale-dialog")).toBeInTheDocument())
});

test('can save edit dialog', async () => {
    const wrapper = await getWrapper()

    fireEvent.click(wrapper.getByTestId("edit"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("edit-dialog")).toBeInTheDocument())
    fireEvent.click(document.getElementById("success-btn"))
});

test('can save edit dialog failure', async () => {

    await server.use(
        rest.put(`/api/v1/raw/deployments/test/test`, (req, res, ctx) => res(ctx.status(500)))
    )

    const wrapper = await getWrapper()

    fireEvent.click(wrapper.getByTestId("edit"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("edit-dialog")).toBeInTheDocument())
    fireEvent.click(document.getElementById("success-btn"))
    await waitFor(() => expect(document.getElementById("edit-dialog")).not.toBeInTheDocument())
});

test('can delete', async () => {
    await getWrapper()

    fireEvent.click(document.getElementById("top-menu-more"))
    fireEvent.click(document.getElementById("delete-btn"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("delete-dialog")).toBeInTheDocument())
    fireEvent.click(document.getElementById("success-btn"))
    await waitFor(() => expect(document.getElementById("edit-dialog")).not.toBeInTheDocument())
});

test('can delete failure', async () => {
    await server.use(
        rest.delete(`${Deployments.base}/test/test`, (req, res, ctx) => res(ctx.status(500)))
    )

    await getWrapper()

    fireEvent.click(document.getElementById("top-menu-more"))
    fireEvent.click(document.getElementById("delete-btn"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("delete-dialog")).toBeInTheDocument())
    fireEvent.click(document.getElementById("success-btn"))
    await waitFor(() => expect(document.getElementById("edit-dialog")).not.toBeInTheDocument())
});

test('can scale', async () => {
    const wrapper = await getWrapper()

    fireEvent.click(wrapper.getByTestId("scale"))
    await delay(500)

    await waitFor(() => expect(document.getElementById("scale-dialog")).toBeInTheDocument())
    fireEvent.click(document.getElementById("save-scale-btn"))
    await waitFor(() => expect(document.getElementById("scale-dialog")).not.toBeInTheDocument())
});
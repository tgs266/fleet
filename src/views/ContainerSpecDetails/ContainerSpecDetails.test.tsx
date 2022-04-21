import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render,fireEvent,waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import ContainerSpecDetails from './ContainerSpecDetails';
import Layout from '../../layouts/Layout';
import { generateDeployment, generateSystemResources } from '../../testing/type_mocks';
import Deployments from '../../services/k8/deployment.service';
import { delay } from '../../testing/utils';

const server = setupServer(
    rest.get(`${Deployments.base}/test/test`, (req, res, ctx) => res(ctx.json(generateDeployment("test")))),
    rest.get(`/api/v1/system/resources`, (req, res, ctx) => res(ctx.json(generateSystemResources()))),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders without crashing', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/deployments/test/test/container-spec/asdf']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="deployments/:namespace/:deployment/container-spec/:specName" element={<ContainerSpecDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("titledcard-title").innerHTML).toBe("asdf"))
});

test('can refresh', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/deployments/test/test/container-spec/asdf']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="deployments/:namespace/:deployment/container-spec/:specName" element={<ContainerSpecDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)

    await waitFor(() => expect(wrapper.queryByTestId("titledcard-title").innerHTML).toBe("asdf"))
    server.use(
        rest.get(`${Deployments.base}/test/test`, (req, res, ctx) => res(ctx.json(generateDeployment("test")))),
    )
    fireEvent.click(wrapper.getByTestId("refresh"))
    await delay(500)
    await waitFor(() => expect(wrapper.queryByTestId("titledcard-title").innerHTML).toBe("asdf"))
});


test("can change hostPort", async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/deployments/test/test/container-spec/asdf']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="deployments/:namespace/:deployment/container-spec/:specName" element={<ContainerSpecDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)

    await waitFor(() => expect(wrapper.queryByTestId("titledcard-title").innerHTML).toBe("asdf"))
    fireEvent.change(wrapper.getByTestId("0-hostPort"), {target: {value: "3"}})
})

test("can save", async () => {
    server.use(
        rest.put(`${Deployments.base}/test/test/container-spec/asdf`, (req, res, ctx) => res(ctx.json(generateDeployment("test")))),
    )
    const wrapper = render(<MemoryRouter initialEntries={['/deployments/test/test/container-spec/asdf']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="deployments/:namespace/:deployment/container-spec/:specName" element={<ContainerSpecDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)

    await waitFor(() => expect(wrapper.queryByTestId("titledcard-title").innerHTML).toBe("asdf"))
    fireEvent.change(wrapper.getByTestId("0-hostPort"), {target: {value: "3"}})
    fireEvent.click(wrapper.getByTestId("spec-edited-btn"))
    await delay(500)
    await waitFor(() => expect(document.getElementById("update-dialog")).toBeInTheDocument())
    await delay(500)
    fireEvent.click(document.getElementById("success-btn"))
    await delay(500)
    await waitFor(() => expect(document.getElementById("update-dialog")).not.toBeInTheDocument())

})

// test('can handle slider change', async () => {
//     await act(async () => {

//         const wrapper = render(<MemoryRouter initialEntries={['/deployments/test/test/container-spec/asdf']}>
//             <Routes>
//                 <Route path="/" element={<Layout />}>
//                     <Route path="deployments/:namespace/:deployment/container-spec/:specName" element={<ContainerSpecDetails />} />
//                 </Route>
//             </Routes>
//         </MemoryRouter>)
//         await waitFor(() => expect(wrapper.queryByTestId("titledcard-title").innerHTML).toBe("asdf"))
//         await waitFor(() => expect(wrapper.queryByTestId("spec-edited-btn")).toBeDisabled())
//         await waitFor(() => wrapper.getByTestId("CPU Requests-CPU Units"))
//         console.log(wrapper.container.innerHTML)
//         // console.log(document.getElementById("resource-cpu-req-slider"))
//         // console.log(wrapper.getByTestId("resource-cpu-req-slider"))
//         // fireEvent.change(document.getElementById("resource-mem-req-slider"))
//         // await waitFor(() => expect(wrapper.queryByTestId("spec-edited-btn")).not.toBeDisabled())
//     })
// });


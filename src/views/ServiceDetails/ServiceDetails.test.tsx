import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render,waitFor} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import Layout from '../../layouts/Layout';
import { generatePod } from '../../testing/type_mocks';
import Services from '../../services/k8/service.service';
import ServiceDetails from './ServiceDetails';
import { Service } from '../../models/service.model';

const generateService = (name: string): Service => ({
    selector: {"asdf": "asdf"},
    pods: [generatePod("asdf")],
    clusterIp: "asdf",
    name,
    namespace: "test",
    uid: "asdf",
    createdAt: 0,
    annotations: {"asdf": "asdf"},
    labels: {"asdf": "asdf"},
    type: 't',
    ports: [
        {
            name: "1",
            port: 90,
            protocol: "UDP",
            appProtocol: "asdf",
            targetPort: 90,
            nodePort: 3
        }
    ],
    endpoints: [
        {
            host: "asdf",
            ready: "ready",
            nodeName: "asdf",
            ports: [
                {
                    name: "1",
                    port: 90,
                    protocol: "UDP",
                    appProtocol: "asdf",
                }
            ]
        }
    ],

})

const server = setupServer(
    rest.get(`${Services.base}/test/test`, (req, res, ctx) => res(ctx.json(generateService("test")))),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders without crashing', async () => {
    const wrapper = render(<MemoryRouter initialEntries={['/services/test/test']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="services/:namespace/:serviceName" element={<ServiceDetails />} />
            </Route>
        </Routes>
    </MemoryRouter>)
    await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))
});

// test('renders without crashing with labels and annotations', async () => {
//     await server.use(
//         rest.get(`${Pods.base}/test/test`, (req, res, ctx) => res(ctx.json(generatePodWithAnnotationAndLabels("test")))
//     ))

//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)
//     await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))
// });

// test('can refresh', async () => {
//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)

//     await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))

//     await server.use(
//         rest.get(`${Pods.base}/test/test`, (req, res, ctx) => res(ctx.json(generatePod("test1")))
//     ))

//     fireEvent.click(wrapper.getByTestId("refresh"))
//     await delay(500)
//     await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test1"))
// });

// test('can toggle edit dialog', async () => {
//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)

//     await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))

//     fireEvent.click(wrapper.getByTestId("edit"))
//     await delay(500)

//     await waitFor(() => expect(document.getElementById("edit-dialog")).toBeInTheDocument())
// });

// test('can save from edit dialog', async () => {
//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)

//     await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))

//     fireEvent.click(wrapper.getByTestId("edit"))
//     await delay(500)

//     await waitFor(() => expect(document.getElementById("edit-dialog")).toBeInTheDocument())

//     fireEvent.click(document.getElementById("success-btn"))

//     await waitFor(() => expect(document.getElementById("edit-dialog")).not.toBeInTheDocument())
// });

// test('can handle failure from saving edit dialog', async () => {
//     await server.use(
//         rest.put("/api/v1/raw/pods/test/test", (req, res, ctx) => res(ctx.status(404), ctx.json({
//             errorMessage: 'Network error',
//         }))),
//     )

//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)

//     await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))

//     fireEvent.click(wrapper.getByTestId("edit"))
//     await delay(500)

//     await waitFor(() => expect(document.getElementById("edit-dialog")).toBeInTheDocument())

//     fireEvent.click(document.getElementById("success-btn"))

//     await waitFor(() => expect(document.getElementById("edit-dialog")).not.toBeInTheDocument())
// });

// test('can delete', async () => {
//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)

//     await act(async () => {
//         await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))

//         document.getElementById("top-menu-more").click()
//         document.getElementById("menu-delete").click()
//         await delay(500)

//         await waitFor(() => expect(document.getElementById("delete-dialog")).toBeInTheDocument())
//         fireEvent.click(document.getElementById("success-btn"))
//         await delay(500)

//         await waitFor(() => {
//             const els = document.getElementsByClassName("toast")
//             if (els.length !== 0) {
//                 return expect(els[0].innerHTML).toContain("Deleted")
//             }
//             return null
//         })
//     })
// });

// test('can handle delete failure', async () => {
//     const wrapper = render(<MemoryRouter initialEntries={['/pods/test/test']}>
//         <Routes>
//             <Route path="/" element={<Layout />}>
//                 <Route path="pods/:namespace/:podName" element={<PodDetails />} />
//             </Route>
//         </Routes>
//     </MemoryRouter>)

//     await server.use(
//         rest.delete("/api/v1/pods/test/test", (req, res, ctx) => {
//             const err: FleetError = {
//                 code: 404,
//                 message: "msg",
//                 status: "asdf"
//             }
//             return res(ctx.status(404), ctx.json(err))
//         }),
//     )
//     await act(async () => {
//         await waitFor(() => expect(wrapper.queryByTestId("infocard-title").innerHTML).toBe("test"))
    
//         document.getElementById("top-menu-more").click()
//         document.getElementById("menu-delete").click()
//         await delay(500)
    
//         await waitFor(() => expect(document.getElementById("delete-dialog")).toBeInTheDocument())
//         fireEvent.click(document.getElementById("success-btn"))
//         await delay(500)
//     })
// });

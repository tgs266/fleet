import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import Layout from '../../layouts/Layout';
import { generateServiceMeta } from '../../testing/type_mocks';
import ServiceList from './ServiceList';
import Services from '../../services/k8/service.service';
import ServiceTable from './ServiceTable';


const server = setupServer(
    rest.get(`${Services.base}/*`, (req, res, ctx) => {
        const count = 20 
        const items = []
        for (let i = 0; i < count; i+=1) {
            items.push(generateServiceMeta(`${i}-asdf`))
        }
        return res(ctx.json({
            items,
            total: items.length
        }))
    }
    ),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders without crashing', async () => {
    render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<ServiceList />} />
            </Route>
        </Routes>
    </MemoryRouter>)
});

test('render 2', async () => {
    render(<MemoryRouter initialEntries={['/']}>
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route path="" element={<ServiceTable namespace={null} />} />
            </Route>
        </Routes>
    </MemoryRouter>)

});

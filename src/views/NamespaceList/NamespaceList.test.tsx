import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import Layout from '../../layouts/Layout';
import NamespaceList from './NamespaceList';
import { NamespaceMeta } from '../../models/namespace.model';
import Namespaces from '../../services/k8/namespace.service';

const generateNamespace = (name: string): NamespaceMeta => ({
    name,
    uid: name,
    createdAt: 0,
    labels: {"adsf": "asdf"},
    annotations: {"asdf": "asdf"},
    status: "Running"
})

const server = setupServer(
    rest.get(`${Namespaces.base}/*`, (req, res, ctx) => {
        const count = 20 
        const items = []
        for (let i = 0; i < count; i+=1) {
            items.push(generateNamespace(`${i}-asdf`))
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
                <Route path="" element={<NamespaceList />} />
            </Route>
        </Routes>
    </MemoryRouter>)
});
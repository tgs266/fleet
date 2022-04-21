import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import {render} from '@testing-library/react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom'
import Layout from '../../layouts/Layout';
import { generateNode } from '../../testing/type_mocks';
import Nodes from '../../services/k8/node.service';
import NodeList from './NodeList';


const server = setupServer(
    rest.get(`${Nodes.base}/*`, (req, res, ctx) => {
        const count = 20 
        const items = []
        for (let i = 0; i < count; i+=1) {
            items.push(generateNode(`${i}-asdf`))
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
                <Route path="" element={<NodeList />} />
            </Route>
        </Routes>
    </MemoryRouter>)
});
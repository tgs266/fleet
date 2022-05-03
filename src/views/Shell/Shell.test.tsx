import { render } from '@testing-library/react';
import WS from 'jest-websocket-mock';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Layout from '../../layouts/Layout';
import { getWSUrl } from '../../services/axios.service';
import Shell from './Shell';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = new WS(getWSUrl('/ws/v1/pods/test/test/containers/asdf/exec'));
test('can render without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/pods/test/test/containers/asdf/shell']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="pods/:namespace/:podName/containers/:containerName/shell"
                        element={<Shell />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

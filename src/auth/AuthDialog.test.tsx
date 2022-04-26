import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import AuthDialog from './AuthDialog';
import Layout from '../layouts/Layout';
import Auth from '../services/auth.service';
import { delay } from '../testing/utils';

const server = setupServer(
    rest.get(`${Auth.base}/oauth2`, (req, res, ctx) =>
        res(
            ctx.json({
                available: true,
            })
        )
    ),
    rest.post(`${Auth.base}/login`, (req, res, ctx) =>
        res(
            ctx.json({
                token: 'asdf',
            })
        )
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={<AuthDialog mode="UNAUTHORIZED" onClose={() => {}} />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

test('renders without crashing 2', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={<AuthDialog mode="UNAUTHORIZED_EXPIRED" onClose={() => {}} />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

test('can login with token', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={<AuthDialog mode="UNAUTHORIZED" onClose={() => {}} />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    fireEvent.change(wrapper.getByTestId('token-input'), { target: { value: 'asdf' } });
    fireEvent.click(document.getElementById('token-signin'));
    await delay(500);
    await waitFor(() => expect(document.getElementById('auth-dialog')).not.toBeInTheDocument());
});

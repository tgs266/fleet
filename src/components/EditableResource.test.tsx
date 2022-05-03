import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';
import Layout from '../layouts/Layout';
import { delay } from '../testing/utils';
import EditableResource from './EditableResource';
import { FleetError } from '../models/base';

const server = setupServer(
    rest.get('http://localhost/api/v1/raw/pods/asdf/name', (req, res, ctx) => res(ctx.json({}))),
    rest.put('http://localhost/api/v1/raw/pods/asdf/name', (req, res, ctx) => res(ctx.json({}))),
    rest.delete('http://localhost/api/v1/raw/pods/asdf/name', (req, res, ctx) => res(ctx.json({}))),
    rest.get('http://localhost/api/v1/raw/pods/name', (req, res, ctx) => res(ctx.json({}))),
    rest.put('http://localhost/api/v1/raw/pods/name', (req, res, ctx) => res(ctx.json({}))),
    rest.delete('http://localhost/api/v1/raw/pods/name', (req, res, ctx) => res(ctx.json({})))
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('can render', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={
                            <EditableResource delete type="pods" name="name" namespace="asdf" />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

it('can toggle edit', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={
                            <EditableResource delete type="pods" name="name" namespace="asdf" />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    fireEvent.click(wrapper.getByTestId('resource-edit'));
    await delay(500);
    await waitFor(() => expect(document.getElementById('edit-dialog')).toBeInTheDocument());
});

test('can save from edit dialog', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={
                            <EditableResource delete type="pods" name="name" namespace="asdf" />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    fireEvent.click(wrapper.getByTestId('resource-edit'));
    await delay(500);

    await waitFor(() => expect(document.getElementById('edit-dialog')).toBeInTheDocument());

    fireEvent.click(document.getElementById('success-btn'));

    await waitFor(() => expect(document.getElementById('edit-dialog')).not.toBeInTheDocument());
});

test('can handle failure from saving edit dialog', async () => {
    await server.use(
        rest.put('http://localhost/api/v1/raw/pods/asdf/name', (req, res, ctx) =>
            res(
                ctx.status(404),
                ctx.json({
                    errorMessage: 'Network error',
                })
            )
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={
                            <EditableResource delete type="pods" name="name" namespace="asdf" />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.getByTestId('resource-edit')).toBeInTheDocument());

    fireEvent.click(wrapper.getByTestId('resource-edit'));
    await delay(500);

    await waitFor(() => expect(document.getElementById('edit-dialog')).toBeInTheDocument());

    fireEvent.click(document.getElementById('success-btn'));

    await waitFor(() => expect(document.getElementById('edit-dialog')).not.toBeInTheDocument());
});

test('can delete', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={
                            <EditableResource delete type="pods" name="name" namespace="asdf" />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await act(async () => {
        document.getElementById('top-menu-more').click();
        await delay(200);
        document.getElementById('resource-delete').click();
        await delay(500);

        await waitFor(() =>
            expect(document.getElementById('delete-resource-dialog')).toBeInTheDocument()
        );
        fireEvent.click(document.getElementById('success-btn'));
        await delay(500);

        await waitFor(() => {
            const els = document.getElementsByClassName('toast');
            if (els.length !== 0) {
                return expect(els[0].innerHTML).toContain('Deleted');
            }
            return null;
        });
    });
});

test('can handle delete failure', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path=""
                        element={
                            <EditableResource delete type="pods" name="name" namespace="asdf" />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await server.use(
        rest.delete('http://localhost/api/v1/raw/pods/asdf/name', (req, res, ctx) => {
            const err: FleetError = {
                code: 404,
                message: 'msg',
                status: 'asdf',
            };
            return res(ctx.status(404), ctx.json(err));
        })
    );
    await act(async () => {
        document.getElementById('top-menu-more').click();
        await delay(200);
        document.getElementById('resource-delete').click();
        await delay(500);

        await waitFor(() =>
            expect(document.getElementById('delete-resource-dialog')).toBeInTheDocument()
        );
        fireEvent.click(document.getElementById('success-btn'));
        await delay(500);
    });
});

it('can toggle edit no namespace', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<EditableResource delete type="pods" name="name" />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    fireEvent.click(wrapper.getByTestId('resource-edit'));
    await delay(500);
    await waitFor(() => expect(document.getElementById('edit-dialog')).toBeInTheDocument());
});

test('can save from edit dialog no namespace', async () => {
    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<EditableResource delete type="pods" name="name" />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    fireEvent.click(wrapper.getByTestId('resource-edit'));
    await delay(500);

    await waitFor(() => expect(document.getElementById('edit-dialog')).toBeInTheDocument());

    fireEvent.click(document.getElementById('success-btn'));

    await waitFor(() => expect(document.getElementById('edit-dialog')).not.toBeInTheDocument());
});

test('can handle failure from saving edit dialog no namespace', async () => {
    await server.use(
        rest.put('http://localhost/api/v1/raw/pods/asdf', (req, res, ctx) =>
            res(
                ctx.status(404),
                ctx.json({
                    errorMessage: 'Network error',
                })
            )
        )
    );

    const wrapper = render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<EditableResource delete type="pods" name="name" />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => expect(wrapper.getByTestId('resource-edit')).toBeInTheDocument());

    fireEvent.click(wrapper.getByTestId('resource-edit'));
    await delay(500);

    await waitFor(() => expect(document.getElementById('edit-dialog')).toBeInTheDocument());

    fireEvent.click(document.getElementById('success-btn'));

    await waitFor(() => expect(document.getElementById('edit-dialog')).not.toBeInTheDocument());
});

test('can delete no namespace', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<EditableResource delete type="pods" name="name" />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await act(async () => {
        document.getElementById('top-menu-more').click();
        await delay(200);
        document.getElementById('resource-delete').click();
        await delay(500);

        await waitFor(() =>
            expect(document.getElementById('delete-resource-dialog')).toBeInTheDocument()
        );
        fireEvent.click(document.getElementById('success-btn'));
        await delay(500);

        await waitFor(() => {
            const els = document.getElementsByClassName('toast');
            if (els.length !== 0) {
                return expect(els[0].innerHTML).toContain('Deleted');
            }
            return null;
        });
    });
});

test('can handle delete failure no namespace', async () => {
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<EditableResource delete type="pods" name="name" />} />
                </Route>
            </Routes>
        </MemoryRouter>
    );

    await server.use(
        rest.delete('http://localhost/api/v1/raw/pods/asdf', (req, res, ctx) => {
            const err: FleetError = {
                code: 404,
                message: 'msg',
                status: 'asdf',
            };
            return res(ctx.status(404), ctx.json(err));
        })
    );
    await act(async () => {
        document.getElementById('top-menu-more').click();
        await delay(200);
        document.getElementById('resource-delete').click();
        await delay(500);

        await waitFor(() =>
            expect(document.getElementById('delete-resource-dialog')).toBeInTheDocument()
        );
        fireEvent.click(document.getElementById('success-btn'));
        await delay(500);
    });
});

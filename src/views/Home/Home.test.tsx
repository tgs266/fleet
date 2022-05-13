import * as React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Layout from '../../layouts/Layout';
import Home from './Home';
import { delay } from '../../testing/utils';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';

function generateQueryResp(metricName: string): PrometheusResponse<PrometheusRangeQueryResponse> {
    return {
        status: 'success',
        error: null,
        errorType: null,
        warnings: [],
        data: {
            resultType: 'asdf',
            result: [
                {
                    metric: { [metricName]: 'asdf' },
                    values: [
                        [new Date().getTime(), '23'],
                        [new Date().getTime(), '2323'],
                        [new Date().getTime(), '76.4'],
                        [new Date().getTime(), '56'],
                        [new Date().getTime(), '22342'],
                        [new Date().getTime(), '21'],
                        [new Date().getTime(), '233'],
                    ],
                },
            ],
        },
    };
}
const server = setupServer(
    rest.post(`http://localhost/api/v1/metrics/query/range`, (req, res, ctx) =>
        res(
            ctx.json({
                cpuUsage: null,
                cpuCapacity: generateQueryResp('cpuCapacity'),
                memoryUsage: generateQueryResp('memoryUsage'),
                memoryCapacity: generateQueryResp('memoryCapacity'),
                podUsage: generateQueryResp('podUsage'),
                podCapacity: generateQueryResp('podCapacity'),
            })
        )
    ),
    rest.get(`http://localhost:9095/api/v1/electron/current`, (req, res, ctx) => {
        res(ctx.json(null));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders without crashing', async () => {
    await act(() => {
        render(
            <MemoryRouter initialEntries={['/c']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="c" element={<Home />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );
    });
    await delay(500);
});

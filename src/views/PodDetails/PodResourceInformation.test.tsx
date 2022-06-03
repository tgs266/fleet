import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import Layout from '../../layouts/Layout';
import PodResourceInformation from './PodResourceInformation';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';

function gen1() {
    return {
        status: 'success',
        error: '',
        errorType: '',
        warnings: [],
        data: {
            resultType: 'asdf',
            result: [
                {
                    metric: {},
                    values: [
                        [1234, '1234'],
                        [1234, '1234'],
                        [1234, '1234'],
                        [1234, '1234'],
                        [1234, '1234'],
                        [1234, '1234'],
                    ],
                },
            ],
        },
    } as PrometheusResponse<PrometheusRangeQueryResponse>;
}

function gen2() {
    return {
        status: 'success',
        error: '',
        errorType: '',
        warnings: [''],
        data: {
            resultType: 'asdf',
            result: [],
        },
    } as PrometheusResponse<PrometheusRangeQueryResponse>;
}

test('can render without data', () => {
    render(
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="pods/:namespace/:podName"
                        element={<PodResourceInformation metricsData={{}} />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

test('can render with data', () => {
    render(
        <MemoryRouter initialEntries={['/pods/test/test']}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        path="pods/:namespace/:podName"
                        element={
                            <PodResourceInformation
                                metricsData={{
                                    cpuUsage: gen1(),
                                    cpuRequests: gen1(),
                                    memoryRequests: gen1(),
                                    cpuLimits: gen1(),
                                    memoryLimits: gen1(),
                                    memoryUsage: gen2(),
                                }}
                            />
                        }
                    />
                </Route>
            </Routes>
        </MemoryRouter>
    );
});

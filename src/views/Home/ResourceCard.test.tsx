import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResourceCard from './ResourceCard';
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

test('renders without crashing', async () => {
    render(
        <ResourceCard
            metrics={{
                cpuUsage: generateQueryResp('cpuUsage'),
                cpuCapacity: generateQueryResp('cpuCapacity'),
                memoryUsage: generateQueryResp('memoryUsage'),
                memoryCapacity: generateQueryResp('memoryCapacity'),
                podUsage: generateQueryResp('podUsage'),
                podCapacity: generateQueryResp('podCapacity'),
            }}
        />
    );
});

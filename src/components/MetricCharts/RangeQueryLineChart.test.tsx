import * as React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangeQueryLineChart from './RangeQueryLineChart';

const server = setupServer(
    rest.post('/api/v1/metrics/*', (req, res, ctx) =>
        res(
            ctx.json({
                cpuUsage: {
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
                },
            })
        )
    )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('can render bytes', () => {
    render(
        <RangeQueryLineChart
            bytes
            data={{
                a: {
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
                },
            }}
            labels={{ a: 'asdff' }}
        />
    );
});

it('can render no unit', () => {
    render(
        <RangeQueryLineChart
            data={{
                a: {
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
                                    [1234, '0'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                ],
                            },
                        ],
                    },
                },
            }}
            labels={{ a: 'asdff' }}
        />
    );
});

it('can render unit', () => {
    render(
        <RangeQueryLineChart
            unit="asdf"
            data={{
                a: {
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
                                    [1234, '0.000001'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                ],
                            },
                        ],
                    },
                },
            }}
            labels={{ a: 'asdff' }}
        />
    );
});

it('can render pull data', () => {
    render(
        <RangeQueryLineChart
            unit="asdf"
            queries={{
                a: {
                    query: '',
                },
            }}
            labels={{ a: 'asdff' }}
        />
    );
});

it('can render no data', () => {
    render(
        <RangeQueryLineChart
            unit="asdf"
            data={{
                a: {
                    status: 'success',
                    error: '',
                    errorType: '',
                    warnings: [],
                    data: {
                        resultType: 'asdf',
                        result: [
                            {
                                metric: {},
                                values: [],
                            },
                        ],
                    },
                },
            }}
            labels={{ a: 'asdff' }}
        />
    );
});

it('can render no labels no data', () => {
    render(
        <RangeQueryLineChart
            unit="asdf"
            data={{
                a: null,
            }}
            labels={{ absd: 'asdff' }}
        />
    );
});

it('test', () => {
    render(
        <RangeQueryLineChart
            data={{
                a: {
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
                                    [1234, '0'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                    [1234, '1234'],
                                ],
                            },
                        ],
                    },
                },
            }}
            labels={{ a: 'asdff', b: 'asd3' }}
        />
    );
});

import * as React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RangeQueryLineChart from './RangeQueryLineChart';

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

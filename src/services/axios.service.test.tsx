import { AxiosError } from 'axios';
import { FleetError } from '../models/base';
import { getBackendApiUrl, getWSUrl, handleError } from './axios.service';
import Electron from './electron.service';

test('get ws url', () => {
    Electron.override = true;
    getWSUrl('/asdf');
    Electron.override = false;
    getWSUrl('/asdf');
});

test('get url', () => {
    Electron.override = true;
    getBackendApiUrl('/asdf');
    Electron.override = false;
    getBackendApiUrl('/asdf');
});

test('handle error metrics', () => {
    const err: AxiosError<FleetError> = {
        config: {
            url: 'metrics',
        },
        name: 'asdf',
        message: 'asdf',
        isAxiosError: true,
        toJSON: () => null,
    };

    handleError(err);
});

test('handle error NO_CLUSTER_SELECTED', () => {
    Electron.override = true;
    const err: AxiosError<FleetError> = {
        config: {
            url: '',
        },
        response: {
            data: {
                status: 'NO_CLUSTER_SELECTED',
                code: 500,
                message: 'asdf',
            },
            status: 500,
            statusText: 'asdf',
            config: {},
            headers: {},
        },
        name: 'asdf',
        message: 'asdf',
        isAxiosError: true,
        toJSON: () => null,
    };

    handleError(err);
});

test('handle error KUBERNETES_CONFIG', () => {
    const err: AxiosError<FleetError> = {
        config: {
            url: '',
        },
        response: {
            data: {
                status: 'KUBERNETES_CONFIG',
                code: 500,
                message: 'asdf',
            },
            status: 500,
            statusText: 'asdf',
            config: {},
            headers: {},
        },
        name: 'asdf',
        message: 'asdf',
        isAxiosError: true,
        toJSON: () => null,
    };

    handleError(err);
});

test('handle error UNAUTHORIZED', () => {
    const err: AxiosError<FleetError> = {
        config: {
            url: '',
        },
        response: {
            data: {
                status: 'UNAUTHORIZED',
                code: 500,
                message: 'asdf',
            },
            status: 500,
            statusText: 'asdf',
            config: {},
            headers: {},
        },
        name: 'asdf',
        message: 'asdf',
        isAxiosError: true,
        toJSON: () => null,
    };

    handleError(err);
});

test('handle error UNAUTHORIZED electron', () => {
    Electron.override = true;
    const err: AxiosError<FleetError> = {
        config: {
            url: '',
        },
        response: {
            data: {
                status: 'UNAUTHORIZED',
                code: 500,
                message: 'asdf',
            },
            status: 500,
            statusText: 'asdf',
            config: {},
            headers: {},
        },
        name: 'asdf',
        message: 'asdf',
        isAxiosError: true,
        toJSON: () => null,
    };

    handleError(err);
});

test('handle error UNAUTHORIZED_EXPIRED', () => {
    Electron.override = false;
    const err: AxiosError<FleetError> = {
        config: {
            url: '',
        },
        response: {
            data: {
                status: 'UNAUTHORIZED_EXPIRED',
                code: 500,
                message: 'asdf',
            },
            status: 500,
            statusText: 'asdf',
            config: {},
            headers: {},
        },
        name: 'asdf',
        message: 'asdf',
        isAxiosError: true,
        toJSON: () => null,
    };

    handleError(err);
});

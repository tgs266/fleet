/* eslint-disable import/no-cycle */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-render-return-value */
import React from 'react';
import ReactDOM from 'react-dom';
import { Alert, Intent } from '@blueprintjs/core';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FleetError } from '../models/base';
import Toaster from './toast.service';
import Electron from './electron.service';
import urlJoin from '../utils/urljoin';
import AuthDialog from '../auth/AuthDialog';

export function getWSUrl(path: string): string {
    if (!Electron.isElectron) {
        const currentBase = `${window.location.href.replace(window.location.hash, '')}`;
        return urlJoin(currentBase.replace(window.location.protocol, 'ws:'), path);
    }
    const base = sessionStorage.getItem('path') || '';
    return urlJoin(base.replace('http:', 'ws:').replace('https:', 'ws:'), path);
}

export function getBackendApiUrl(path: string): string {
    if (!Electron.isElectron) {
        const currentBase = `${window.location.href.replace(window.location.hash, '')}`;
        return urlJoin(currentBase, path);
    }
    const base = sessionStorage.getItem('path') || '';
    return urlJoin(base, path);
}

const api = axios.create();
let dialog: HTMLDivElement = null;

api.defaults.baseURL = `${window.location.href.replace(window.location.hash, '')}`;
api.interceptors.request.use((config: AxiosRequestConfig<any>) => {
    const token = localStorage.getItem('jwe');
    if (token) {
        config.headers.jweToken = token;
    }

    return config;
});

function isPromise(p: any) {
    if (typeof p === 'object' && typeof p.then === 'function') {
        return true;
    }

    return false;
}

export function handleError(error: AxiosError<FleetError>) {
    if (error.config.url.includes('metrics')) {
        return;
    }
    // no server running - indicates electron
    if (error.response.data.status === 'NO_CLUSTER_SELECTED' && Electron.isElectron) {
        window.location.href = `${window.location.pathname}#/clusters`;
    } else if (error.response.data.status === 'KUBERNETES_CONFIG') {
        const containerElement = document.createElement('div');
        document.body.appendChild(containerElement);
        ReactDOM.render(
            React.createElement(
                Alert,
                {
                    isOpen: true,
                    onClose: () => {
                        ReactDOM.unmountComponentAtNode(containerElement);
                        containerElement.remove();
                    },
                },
                <div>
                    Could not connect to kubernetes backend. Please make sure you are running a
                    cluster, and specify the kubernetes config file path in the fleet config.
                </div>
            ),
            containerElement
        );
    } else if (
        (error.response.data.status === 'UNAUTHORIZED' ||
            error.response.data.status === 'UNAUTHORIZED_EXPIRED') &&
        !Electron.isElectron
    ) {
        localStorage.removeItem('jwe');
        if (!dialog) {
            dialog = document.createElement('div');
            document.body.appendChild(dialog);
            ReactDOM.render(
                React.createElement(AuthDialog, {
                    mode: error.response.data.status,
                    onClose: () => {
                        ReactDOM.unmountComponentAtNode(dialog);
                        dialog = null;
                        window.location.reload();
                    },
                }),
                dialog
            );
        }
    } else if (
        (error.response.data.status === 'UNAUTHORIZED' ||
            error.response.data.status === 'UNAUTHORIZED_EXPIRED') &&
        Electron.isElectron
    ) {
        window.location.href = `${window.location.pathname}#/clusters`;
    } else {
        Toaster.show({ message: error.response.data.message, intent: Intent.DANGER });
    }
}

api.interceptors.response.use(
    (response: AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) => {
        if (isPromise(response)) {
            return new Promise((resolve) => {
                (response as Promise<AxiosResponse<any, any>>).then((r) => {
                    if (r.headers.username) {
                        localStorage.setItem('username', r.headers.username);
                    }
                    return resolve(r);
                });
            });
        }
        if ((response as any).headers.username) {
            localStorage.setItem('username', (response as any).headers.username);
        }
        return response;
    },
    (error: AxiosError<FleetError>) => {
        handleError(error);
    }
);

export default api;

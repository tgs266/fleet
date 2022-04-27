/* eslint-disable no-param-reassign */
/* eslint-disable react/no-render-return-value */
import React from 'react';
import ReactDOM from 'react-dom';
import { Alert, Intent } from '@blueprintjs/core';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { FleetError } from '../models/base';
import Toaster from './toast.service';
import urlJoin from '../utils/urljoin';
import AuthDialog from '../auth/AuthDialog';

export function getWSUrl(path: string): string {
    const currentBase = `${window.location.href.replace(window.location.hash, '')}`;
    return urlJoin(currentBase.replace(window.location.protocol, 'ws:'), path);
}

const api = axios.create();
let dialog: HTMLDivElement = null;

if (!process.env.TEST_ENV) {
    api.defaults.baseURL = `${window.location.href.replace(window.location.hash, '')}`;
    api.interceptors.request.use((config: AxiosRequestConfig<any>) => {
        const token = localStorage.getItem('jwe');
        if (token) {
            config.headers.jweToken = token;
        }

        return config;
    });
}

api.interceptors.response.use(
    (response: AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) => response,
    (error: AxiosError<FleetError>) => {
        if (error.response.data.status === 'KUBERNETES_CONFIG') {
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
            error.response.data.status === 'UNAUTHORIZED' ||
            error.response.data.status === 'UNAUTHORIZED_EXPIRED'
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
        } else {
            Toaster.show({ message: error.response.data.message, intent: Intent.DANGER });
        }
    }
);

export default api;

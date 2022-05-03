/* eslint-disable import/no-cycle */
/* eslint-disable object-shorthand */
import axios, { AxiosResponse } from 'axios';
import urlJoin from '../utils/urljoin';
import api from './axios.service';

export default class Auth {
    static base = urlJoin(window.location.href.replace(window.location.hash, ''), '/api/v1/auth');

    static using(): Promise<AxiosResponse<{ usingAuth: boolean }>> {
        if (process.env.TEST_ENV) {
            return new Promise((resolve) => {
                const x: AxiosResponse<{ usingAuth: boolean }> = {
                    config: {},
                    status: 200,
                    statusText: 'asdf',
                    headers: {},
                    data: {
                        usingAuth: true,
                    },
                };
                resolve(x);
            });
        }
        return axios.get(`${Auth.base}/`);
    }

    static login(token: string): Promise<AxiosResponse<any>> {
        return axios.post(`${Auth.base}/login`, { token: token });
    }

    static getOIDCUrl(): Promise<AxiosResponse<{ url: string }>> {
        return axios.get(`${Auth.base}/oauth2/url`, { params: { location: window.location.href } });
    }

    static refresh(): void {
        const token = localStorage.getItem('jwe');
        if (token) {
            axios.post(`${Auth.base}/refresh`, { token: token }).then((r) => {
                localStorage.setItem('jwe', r.data.token);
                if (r.headers.username) {
                    localStorage.setItem('username', r.headers.username);
                }
            });
        }
    }

    static canUseOIDC(): Promise<AxiosResponse<{ available: boolean }>> {
        return axios.get(`${Auth.base}/oauth2`);
    }

    static canI(
        resource: string,
        verb: string,
        name?: string,
        namespace?: string
    ): Promise<AxiosResponse<{ allowed: boolean }>> {
        if (process.env.TEST_ENV) {
            return new Promise((resolve) => {
                const x: AxiosResponse<{ allowed: boolean }> = {
                    config: {},
                    status: 200,
                    statusText: 'asdf',
                    headers: {},
                    data: {
                        allowed: true,
                    },
                };
                resolve(x);
            });
        }
        return api.get(`${Auth.base}/cani`, { params: { resource, verb, name, namespace } });
    }
}

/* eslint-disable object-shorthand */
import axios, { AxiosResponse } from 'axios';

export default class Auth {
    static base = '/api/v1/auth';

    static login(token: string): Promise<AxiosResponse<any>> {
        return axios.post(`${Auth.base}/login`, { token: token });
    }

    static getOIDCUrl(): Promise<AxiosResponse<any>> {
        return axios.get(`${Auth.base}/oauth2/url`, { params: { location: window.location.href } });
    }

    static refresh(): void {
        const token = localStorage.getItem('jwe');
        if (token) {
            axios.post(`${Auth.base}/refresh`, { token: token }).then((r) => {
                localStorage.setItem('jwe', r.data.token);
            });
        }
    }

    static canUseOIDC(): Promise<AxiosResponse<{ available: boolean }>> {
        return axios.get(`${Auth.base}/oauth2`);
    }
}

import { AxiosResponse } from 'axios';
import api from '../axios.service';

const userAgent = navigator.userAgent.toLowerCase();
let isElectron = false;
if (userAgent.indexOf(' electron/') > -1) {
    isElectron = true;
}

export default class Cluster {
    static base = `${isElectron ? 'http://localhost:9095' : ''}/api/v1/cluster`;

    static getCurrentClusterName(): Promise<AxiosResponse<string>> {
        if (process.env.TEST_ENV) {
            return new Promise((resolve) => {
                const x: AxiosResponse<string> = {
                    config: {},
                    status: 200,
                    statusText: 'asdf',
                    headers: {},
                    data: 'asdf',
                };
                resolve(x);
            });
        }
        return api.get(`${Cluster.base}/name`);
    }
}

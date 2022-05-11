import { AxiosResponse } from 'axios';
import api from '../axios.service';

export default class Cluster {
    static base = '/api/v1/cluster';

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

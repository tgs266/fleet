import { AxiosResponse } from 'axios';
import api from '../axios.service';

export default class Cluster {
    static base = '/api/v1/cluster';

    static getCurrentClusterName(): Promise<AxiosResponse<string>> {
        return api.get(`${Cluster.base}/name`);
    }
}

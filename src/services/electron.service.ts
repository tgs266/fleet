/* eslint-disable import/no-cycle */
import { AxiosResponse } from 'axios';
import { ElectronCluster } from '../models/cluster.model';
import api from './axios.service';

export default class Electron {
    static get isElectron() {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf(' electron/') > -1) {
            return true;
        }
        return false;
    }

    static getClusters(): Promise<AxiosResponse<ElectronCluster[]>> {
        return api.get('http://localhost:9096/api/v1/electron/detect');
    }

    static connectToCluster(cluster: any) {
        return api.post('http://localhost:9096/api/v1/electron/connect', cluster);
    }
}

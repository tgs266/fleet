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

    static get path() {
        return sessionStorage.getItem('path');
    }

    static getClusters(): Promise<AxiosResponse<ElectronCluster[]>> {
        return api.get('http://localhost:9095/api/v1/electron/clusters');
    }

    static getCurrentCluster(): Promise<AxiosResponse<ElectronCluster>> {
        return api.get('http://localhost:9095/api/v1/electron/current');
    }

    static connectToCluster(
        cluster: any
    ): Promise<AxiosResponse<{ token: string; cluster: ElectronCluster }>> {
        return api.post('http://localhost:9095/api/v1/electron/connect', cluster);
    }

    static disconnectFromCluster(
        cluster: string
    ): Promise<AxiosResponse<{ token: string; cluster: ElectronCluster }>> {
        return api.post('http://localhost:9095/api/v1/electron/disconnect', { name: cluster });
    }
}

/* eslint-disable import/no-cycle */
import axios, { AxiosResponse } from 'axios';
import { ElectronCluster } from '../models/cluster.model';

export default class Electron {
    static override = false;

    static get isElectron() {
        if (Electron.override) {
            return true;
        }
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
        return axios.get('http://localhost:9095/api/v1/electron/clusters');
    }

    static getCurrentCluster(): Promise<AxiosResponse<ElectronCluster>> {
        return axios.get('http://localhost:9095/api/v1/electron/current');
    }

    static connectToCluster(
        cluster: any
    ): Promise<AxiosResponse<{ token: string; cluster: ElectronCluster }>> {
        return axios.post('http://localhost:9095/api/v1/electron/connect', cluster);
    }

    static disconnectFromCluster(
        cluster: string
    ): Promise<AxiosResponse<{ token: string; cluster: ElectronCluster }>> {
        return axios.post('http://localhost:9095/api/v1/electron/disconnect', { name: cluster });
    }

    static start(cluster: any): Promise<AxiosResponse<any>> {
        return axios.post('http://localhost:9095/api/v1/electron/start', cluster);
    }

    static stop(cluster: any): Promise<AxiosResponse<any>> {
        return axios.post('http://localhost:9095/api/v1/electron/stop', cluster);
    }
}

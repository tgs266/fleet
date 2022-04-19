/* eslint-disable object-shorthand */
import axios, { AxiosResponse } from 'axios';
import { SystemResources } from '../models/system.model';

export default class System {
    static base = '/api/v1/system';

    static getResources(): Promise<AxiosResponse<SystemResources>> {
        return axios.get(`${System.base}/resources`);
    }
}

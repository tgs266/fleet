/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { SystemResources } from '../models/system.model';
import api from './axios.service';

export default class System {
    static base = '/api/v1/system';

    static getResources(): Promise<AxiosResponse<SystemResources>> {
        return api.get(`${System.base}/resources`);
    }
}

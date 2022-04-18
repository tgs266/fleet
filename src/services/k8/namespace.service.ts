/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { PaginationResponse } from '../../models/base';
import { NamespaceMeta as NS } from '../../models/namespace.model';
import api from '../axios.service';

export default class Namespaces {
    static base = 'http://localhost:8000/api/v1/namespaces';

    static getNamespaces(): Promise<AxiosResponse<PaginationResponse<NS>>> {
        return api.get(`${Namespaces.base}/`);
    }

    static getNamespace(name: string): Promise<AxiosResponse<NS>> {
        return api.get(`${Namespaces.base}/${name}`);
    }
}

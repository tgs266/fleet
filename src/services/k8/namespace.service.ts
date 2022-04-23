/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { NamespaceMeta as NS } from '../../models/namespace.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class Namespaces {
    static base = '/api/v1/namespaces';

    static getNamespaces(
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<NS>>> {
        return api.get(`${Namespaces.base}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }

    static getNamespace(name: string): Promise<AxiosResponse<NS>> {
        return api.get(`${Namespaces.base}/${name}`);
    }
}

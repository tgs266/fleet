/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { NamespaceMeta as NS } from '../../models/namespace.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api from '../axios.service';
import Electron from '../electron.service';

export default class Namespaces {
    static base = `${Electron.isElectron ? 'http://localhost:9095' : ''}/api/v1/namespaces`;

    static getNamespaces(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<NS>>> {
        return api.get(`${Namespaces.base}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy: parseFilters(filters) },
        });
    }

    static getNamespace(name: string): Promise<AxiosResponse<NS>> {
        return api.get(`${Namespaces.base}/${name}`);
    }
}

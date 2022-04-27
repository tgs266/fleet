import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { ServiceAccount, ServiceAccountMeta } from '../../models/serviceaccount.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class ServiceAccounts {
    static base = '/api/v1/serviceaccounts';

    static getServiceAccount(
        name: string,
        namespace?: string
    ): Promise<AxiosResponse<ServiceAccount>> {
        return api.get(`${ServiceAccounts.base}/${namespace}/${name}`);
    }

    static getServiceAccounts(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.get(`${ServiceAccounts.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

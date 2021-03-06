import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { BindRequest, ServiceAccount, ServiceAccountMeta } from '../../models/serviceaccount.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';

export default class ServiceAccounts {
    static base = `/api/v1/serviceaccounts`;

    static getServiceAccount(
        name: string,
        namespace?: string
    ): Promise<AxiosResponse<ServiceAccount>> {
        return api.get(`${getBackendApiUrl(ServiceAccounts.base)}/${namespace}/${name}`);
    }

    static getServiceAccounts(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${getBackendApiUrl(ServiceAccounts.base)}/${namespace || '_all_'}`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }

    static bindToRole(
        name: string,
        namespace: string,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(
            `${getBackendApiUrl(ServiceAccounts.base)}/${namespace}/${name}/bind/role`,
            req
        );
    }

    static bindToClusterRole(
        name: string,
        namespace: string,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(
            `${getBackendApiUrl(ServiceAccounts.base)}/${namespace}/${name}/bind/clusterrole`,
            req
        );
    }

    static disconnectRole(
        name: string,
        namespace: string,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(
            `${getBackendApiUrl(ServiceAccounts.base)}/${namespace}/${name}/remove/role`,
            req
        );
    }

    static disconnectClusterRole(
        name: string,
        namespace: string,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(
            `${getBackendApiUrl(ServiceAccounts.base)}/${namespace}/${name}/remove/clusterrole`,
            req
        );
    }
}

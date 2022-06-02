import { AxiosResponse } from 'axios';
import { PaginationResponse } from '../../models/base';
import { BindRequest, ServiceAccount, ServiceAccountMeta } from '../../models/serviceaccount.model';
import api from '../axios.service';
import Resource, { ResourceGetParams } from './resource.service';

export default class ServiceAccounts extends Resource<ServiceAccountMeta, ServiceAccount> {
    static base = `/api/v1/serviceaccounts`;

    base = ServiceAccounts.base;

    bindToRole(
        params: ResourceGetParams,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(`${this.getNamespaceNameUrl(params)}/bind/role`, req);
    }

    bindToClusterRole(
        params: ResourceGetParams,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(`${this.getNamespaceNameUrl(params)}/bind/clusterrole`, req);
    }

    disconnectRole(
        params: ResourceGetParams,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(`${this.getNamespaceNameUrl(params)}/remove/role`, req);
    }

    disconnectClusterRole(
        params: ResourceGetParams,
        req: BindRequest
    ): Promise<AxiosResponse<PaginationResponse<ServiceAccountMeta>>> {
        return api.put(`${this.getNamespaceNameUrl(params)}/remove/clusterrole`, req);
    }
}

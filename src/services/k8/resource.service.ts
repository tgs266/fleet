/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { convertToWSUrl, getBackendApiUrl } from '../axios.service';
import WS from '../websocket.service';

export interface ResourceGetParams {
    name?: string;
    namespace?: string;
}
export interface ResourceListParams {
    namespace?: string;
    sort?: TableSort;
    offset?: number;
    pageSize?: number;
    filters?: Filter[];
}

export const EMPTY_LIST_PARAMS: ResourceListParams = {
    sort: null,
    offset: null,
    pageSize: null,
    filters: null,
};

export default class Resource<M, F> {
    base = '/api/v1';

    namespaced = false;

    filterable = false;

    constructor(namespaced?: boolean, filterable?: boolean) {
        this.namespaced = namespaced;
        this.filterable = filterable;
    }

    getNamespaceUrl = (params: ResourceGetParams) => {
        if (this.namespaced) {
            return `${getBackendApiUrl(this.base)}/${params.namespace}`;
        }
        return getBackendApiUrl(this.base);
    };

    getNamespaceNameUrl = (params: ResourceGetParams) =>
        `${this.getNamespaceUrl(params)}/${params.name}`;

    get = (params: ResourceGetParams): Promise<AxiosResponse<F>> => {
        console.log(this.getNamespaceNameUrl(params));
        return api.get(this.getNamespaceNameUrl(params));
    };

    list = (
        params: ResourceListParams = EMPTY_LIST_PARAMS
    ): Promise<AxiosResponse<PaginationResponse<M>>> => {
        let url = '';
        if (this.namespaced) {
            const ns = params ? params.namespace : null;
            url = this.getNamespaceUrl({
                namespace: ns || '_all_',
            });
        } else {
            url = getBackendApiUrl(this.base);
        }
        return api.get(url, {
            params: {
                sortBy: getSortBy(params.sort),
                offset: params.offset,
                pageSize: params.pageSize,
                filterBy: parseFilters(params.filters),
            },
        });
    };

    getWebsocket = (path: string, interval: number = 2500) =>
        new WS(convertToWSUrl(path), interval);

    ws = (params: ResourceGetParams, interval: number = 1000): WS => {
        console.log(this.getNamespaceNameUrl(params));
        return this.getWebsocket(
            this.getNamespaceNameUrl(params).replace('/api/', '/ws/'),
            interval
        );
    };
}

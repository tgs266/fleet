/* eslint-disable import/no-cycle */
import axios, { AxiosResponse } from 'axios';
import { PaginationResponse } from '../models/base';
import { Chart, ChartInstall, Release } from '../models/helm.model';
import { parseFilters } from '../utils/sort';
import { getBackendApiUrl } from './axios.service';
import { ResourceListParams } from './k8/resource.service';

export default class Helm {
    static base = `/api/v1/helm`;

    static queryCharts(
        params: ResourceListParams
    ): Promise<AxiosResponse<PaginationResponse<Chart>>> {
        const filterBy = parseFilters(params.filters);
        let sortBy = '';
        if (params.sort) {
            sortBy = `${params.sort.sortableId},${params.sort.ascending ? 'a' : 'd'}`;
        }
        return axios.get(`${getBackendApiUrl(Helm.base)}/charts`, {
            params: { sortBy, offset: params.offset, pageSize: params.pageSize, filterBy },
        });
    }

    static queryReleases(
        params: ResourceListParams
    ): Promise<AxiosResponse<PaginationResponse<Release>>> {
        const filterBy = parseFilters(params.filters);
        let sortBy = '';
        if (params.sort) {
            sortBy = `${params.sort.sortableId},${params.sort.ascending ? 'a' : 'd'}`;
        }
        return axios.get(`${getBackendApiUrl(Helm.base)}/releases`, {
            params: { sortBy, offset: params.offset, pageSize: params.pageSize, filterBy },
        });
    }

    static getChart(repo: string, name: string): Promise<AxiosResponse<Chart>> {
        return axios.get(`${getBackendApiUrl(Helm.base)}/charts/${repo}/${name}`);
    }

    static getRelease(name: string): Promise<AxiosResponse<Release>> {
        return axios.get(`${getBackendApiUrl(Helm.base)}/releases/${name}`);
    }

    static installChart(data: ChartInstall): Promise<AxiosResponse<Chart>> {
        return axios.post(`${getBackendApiUrl(Helm.base)}/charts/install`, data);
    }
}

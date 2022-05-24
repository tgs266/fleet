/* eslint-disable import/no-cycle */
import axios, { AxiosResponse } from 'axios';
import { TableSort } from '../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../models/base';
import { Chart, ChartInstall, Release } from '../models/helm.model';
import { parseFilters } from '../utils/sort';
import { getBackendApiUrl } from './axios.service';

export default class Helm {
    static base = `/api/v1/helm`;

    static queryCharts(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<Chart>>> {
        const filterBy = parseFilters(filters);
        let sortBy = '';
        if (sort) {
            sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
        }
        return axios.get(`${getBackendApiUrl(Helm.base)}/charts`, {
            params: { sortBy, offset, pageSize, filterBy },
        });
    }

    static queryReleases(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<Release>>> {
        const filterBy = parseFilters(filters);
        let sortBy = '';
        if (sort) {
            sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
        }
        return axios.get(`${getBackendApiUrl(Helm.base)}/releases`, {
            params: { sortBy, offset, pageSize, filterBy },
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

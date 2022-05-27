import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { ClusterRole, ClusterRoleMeta } from '../../models/clusterrole.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';
import SSE from '../sse.service';

export default class ClusterRoles {
    static base = `/api/v1/clusterroles`;

    static getClusterRole(name: string): Promise<AxiosResponse<ClusterRole>> {
        return api.get(`${getBackendApiUrl(ClusterRoles.base)}/${name}`);
    }

    static getClusterRoles(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ClusterRoleMeta>>> {
        return api.get(`${getBackendApiUrl(ClusterRoles.base)}`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy: parseFilters(filters) },
        });
    }

    static sse(name: string, interval: number = 1000): SSE {
        const x = new SSE(
            `${getBackendApiUrl(ClusterRoles.base.replace('/api/', '/sse/'))}/${name}`,
            interval
        );
        return x;
    }
}

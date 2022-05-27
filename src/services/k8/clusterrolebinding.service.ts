import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { ClusterRoleBinding, ClusterRoleBindingMeta } from '../../models/clusterrole.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';
import SSE from '../sse.service';

export default class ClusterRoleBindings {
    static base = `/api/v1/clusterrolebindings`;

    static getClusterRoleBinding(name: string): Promise<AxiosResponse<ClusterRoleBinding>> {
        return api.get(`${getBackendApiUrl(ClusterRoleBindings.base)}/${name}`);
    }

    static getClusterRoleBindings(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ClusterRoleBindingMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${getBackendApiUrl(ClusterRoleBindings.base)}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }

    static sse(name: string, interval: number = 1000): SSE {
        const x = new SSE(
            `${getBackendApiUrl(ClusterRoleBindings.base.replace('/api/', '/sse/'))}/${name}`,
            interval
        );
        return x;
    }
}

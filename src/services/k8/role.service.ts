import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { Role, RoleMeta } from '../../models/role.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';
import SSE from '../sse.service';

export default class Roles {
    static base = `/api/v1/roles`;

    static getRole(name: string, namespace?: string): Promise<AxiosResponse<Role>> {
        return api.get(`${getBackendApiUrl(Roles.base)}/${namespace}/${name}`);
    }

    static getRoles(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<RoleMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${getBackendApiUrl(Roles.base)}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }

    static sse(name: string, namespace: string, interval: number = 1000): SSE {
        const x = new SSE(
            `${getBackendApiUrl(Roles.base.replace('/api/', '/sse/'))}/${namespace}/${name}`,
            interval
        );
        return x;
    }
}

import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { Role, RoleMeta } from '../../models/role.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';

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
}

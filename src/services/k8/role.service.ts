import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { Role, RoleMeta } from '../../models/role.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class Roles {
    static base = '/api/v1/roles';

    static getRole(name: string, namespace?: string): Promise<AxiosResponse<Role>> {
        return api.get(`${Roles.base}/${namespace}/${name}`);
    }

    static getRoles(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<RoleMeta>>> {
        return api.get(`${Roles.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

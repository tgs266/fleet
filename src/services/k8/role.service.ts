import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { Role, RoleMeta } from '../../models/role.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api from '../axios.service';
import Electron from '../electron.service';

export default class Roles {
    static base = `${Electron.isElectron ? `http://localhost:9095/proxy` : ''}/api/v1/roles`;

    static getRole(name: string, namespace?: string): Promise<AxiosResponse<Role>> {
        return api.get(`${Roles.base}/${namespace}/${name}`);
    }

    static getRoles(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<RoleMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${Roles.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }
}

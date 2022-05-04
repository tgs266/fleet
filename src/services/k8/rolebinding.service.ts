import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { RoleBinding, RoleBindingMeta } from '../../models/role.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api from '../axios.service';

export default class RoleBindings {
    static base = '/api/v1/rolebindings';

    static getRoleBinding(name: string, namespace?: string): Promise<AxiosResponse<RoleBinding>> {
        return api.get(`${RoleBindings.base}/${namespace}/${name}`);
    }

    static getRoleBindings(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<RoleBindingMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${RoleBindings.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }
}

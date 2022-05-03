import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { RoleBinding, RoleBindingMeta } from '../../models/role.model';
import getSortBy from '../../utils/sort';
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
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<RoleBindingMeta>>> {
        return api.get(`${RoleBindings.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { ClusterRoleBinding, ClusterRoleBindingMeta } from '../../models/clusterrole.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class ClusterRoleBindings {
    static base = '/api/v1/clusterrolebindings';

    static getClusterRoleBinding(name: string): Promise<AxiosResponse<ClusterRoleBinding>> {
        return api.get(`${ClusterRoleBindings.base}/${name}`);
    }

    static getClusterRoleBindings(
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<ClusterRoleBindingMeta>>> {
        return api.get(`${ClusterRoleBindings.base}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

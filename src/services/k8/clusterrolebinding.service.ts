import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { ClusterRoleBinding, ClusterRoleBindingMeta } from '../../models/clusterrole.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api from '../axios.service';
import Electron from '../electron.service';

export default class ClusterRoleBindings {
    static base = `${
        Electron.isElectron ? 'http://localhost:9095' : ''
    }/api/v1/clusterrolebindings`;

    static getClusterRoleBinding(name: string): Promise<AxiosResponse<ClusterRoleBinding>> {
        return api.get(`${ClusterRoleBindings.base}/${name}`);
    }

    static getClusterRoleBindings(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ClusterRoleBindingMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${ClusterRoleBindings.base}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }
}

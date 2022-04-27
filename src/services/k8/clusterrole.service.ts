import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { ClusterRole, ClusterRoleMeta } from '../../models/clusterrole.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class ClusterRoles {
    static base = '/api/v1/clusterroles';

    static getClusterRole(name: string): Promise<AxiosResponse<ClusterRole>> {
        return api.get(`${ClusterRoles.base}/${name}`);
    }

    static getClusterRoles(
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<ClusterRoleMeta>>> {
        return api.get(`${ClusterRoles.base}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

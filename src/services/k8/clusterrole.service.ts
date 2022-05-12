import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { ClusterRole, ClusterRoleMeta } from '../../models/clusterrole.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api from '../axios.service';
import Electron from '../electron.service';

export default class ClusterRoles {
    static base = `${Electron.isElectron ? `http://localhost:9095/proxy` : ''}/api/v1/clusterroles`;

    static getClusterRole(name: string): Promise<AxiosResponse<ClusterRole>> {
        return api.get(`${ClusterRoles.base}/${name}`);
    }

    static getClusterRoles(
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ClusterRoleMeta>>> {
        return api.get(`${ClusterRoles.base}`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy: parseFilters(filters) },
        });
    }
}

import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { ReplicaSet, ReplicaSetMeta } from '../../models/replicaset.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';
import SSE from '../sse.service';

export default class ReplicaSets {
    static base = `/api/v1/replicasets`;

    static getReplicaSet(
        serviceName: string,
        namespace?: string
    ): Promise<AxiosResponse<ReplicaSet>> {
        return api.get(`${getBackendApiUrl(ReplicaSets.base)}/${namespace}/${serviceName}`);
    }

    static getReplicaSets(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ReplicaSetMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${getBackendApiUrl(ReplicaSets.base)}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }

    static sse(name: string, namespace: string, interval: number = 1000): SSE {
        const x = new SSE(
            `${getBackendApiUrl(ReplicaSets.base.replace('/api/', '/sse/'))}/${namespace}/${name}`,
            interval
        );
        return x;
    }

    static restartReplicaSet(replicaSet: string, namespace: string): Promise<AxiosResponse<any>> {
        return api.put(`${getBackendApiUrl(ReplicaSets.base)}/${namespace}/${replicaSet}/restart`);
    }
}

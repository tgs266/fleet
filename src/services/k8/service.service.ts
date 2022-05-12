import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { Service, ServiceMeta } from '../../models/service.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';

export default class Services {
    static base = `/api/v1/services`;

    static getService(serviceName: string, namespace?: string): Promise<AxiosResponse<Service>> {
        return api.get(`${getBackendApiUrl(Services.base)}/${namespace}/${serviceName}`);
    }

    static getServices(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ServiceMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${getBackendApiUrl(Services.base)}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }
}

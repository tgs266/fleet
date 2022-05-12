import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { Service, ServiceMeta } from '../../models/service.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api from '../axios.service';
import Electron from '../electron.service';

export default class Services {
    static base = `${Electron.isElectron ? 'http://localhost:9095' : ''}/api/v1/services`;

    static getService(serviceName: string, namespace?: string): Promise<AxiosResponse<Service>> {
        return api.get(`${Services.base}/${namespace}/${serviceName}`);
    }

    static getServices(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<ServiceMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${Services.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }
}

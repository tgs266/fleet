import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { Service, ServiceMeta } from '../../models/service.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class Services {
    static base = '/api/v1/services';

    static getService(serviceName: string, namespace?: string): Promise<AxiosResponse<Service>> {
        return api.get(`${Services.base}/${namespace}/${serviceName}`);
    }

    static getServices(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<ServiceMeta>>> {
        return api.get(`${Services.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

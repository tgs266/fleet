import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { Service, ServiceMeta } from '../../models/service.model';
import api from '../axios.service';

export default class Services {
    static base = 'http://localhost:51115/api/v1/services';

    static getService(serviceName: string, namespace?: string): Promise<AxiosResponse<Service>> {
        return api.get(`${Services.base}/${namespace}/${serviceName}`);
    }

    static getServices(
        namespace?: string,
        sort?: TableSort
    ): Promise<AxiosResponse<PaginationResponse<ServiceMeta>>> {
        let sortBy = '';
        if (sort) {
            sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
        }
        return api.get(`${Services.base}/${namespace}/`, { params: { sortBy } });
    }
}

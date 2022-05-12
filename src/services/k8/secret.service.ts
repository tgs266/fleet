import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Filter, PaginationResponse } from '../../models/base';
import { Secret, SecretMeta } from '../../models/secret.model';
import getSortBy, { parseFilters } from '../../utils/sort';
import api, { getBackendApiUrl } from '../axios.service';

export default class Secrets {
    static base = `/api/v1/secrets`;

    static getSecret(secretName: string, namespace?: string): Promise<AxiosResponse<Secret>> {
        return api.get(`${getBackendApiUrl(Secrets.base)}/${namespace}/${secretName}`);
    }

    static getSecrets(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number,
        filters?: Filter[]
    ): Promise<AxiosResponse<PaginationResponse<SecretMeta>>> {
        const filterBy = parseFilters(filters);
        return api.get(`${getBackendApiUrl(Secrets.base)}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize, filterBy },
        });
    }
}

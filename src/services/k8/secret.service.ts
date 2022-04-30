import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PaginationResponse } from '../../models/base';
import { Secret, SecretMeta } from '../../models/secret.model';
import getSortBy from '../../utils/sort';
import api from '../axios.service';

export default class Secrets {
    static base = '/api/v1/secrets';

    static getSecret(secretName: string, namespace?: string): Promise<AxiosResponse<Secret>> {
        return api.get(`${Secrets.base}/${namespace}/${secretName}`);
    }

    static getSecrets(
        namespace?: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<PaginationResponse<SecretMeta>>> {
        return api.get(`${Secrets.base}/${namespace || '_all_'}/`, {
            params: { sortBy: getSortBy(sort), offset, pageSize },
        });
    }
}

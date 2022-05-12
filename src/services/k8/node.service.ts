/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Node, NodeMeta } from '../../models/node.model';
import { generateNode } from '../../testing/type_mocks';
import api, { getBackendApiUrl } from '../axios.service';

export default class Nodes {
    static base = `/api/v1/nodes`;

    static getNodes(): Promise<AxiosResponse<NodeMeta[]>> {
        if (process.env.TEST_ENV) {
            return new Promise((resolve) => {
                const x: AxiosResponse<NodeMeta[]> = {
                    config: {},
                    status: 200,
                    statusText: 'asdf',
                    headers: {},
                    data: [generateNode('asdf')],
                };
                resolve(x);
            });
        }
        return api.get(`${getBackendApiUrl(Nodes.base)}/`);
    }

    static getNode(
        name: string,
        sort?: TableSort,
        offset?: number,
        pageSize?: number
    ): Promise<AxiosResponse<Node>> {
        let sortBy = '';
        if (sort) {
            sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
        }
        return api.get(`${getBackendApiUrl(Nodes.base)}/${name}`, {
            params: { sortBy, offset, pageSize },
        });
    }
}

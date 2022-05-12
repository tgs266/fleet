/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Node, NodeMeta } from '../../models/node.model';
import { generateNode } from '../../testing/type_mocks';
import api from '../axios.service';
import Electron from '../electron.service';

export default class Nodes {
    static base = `${Electron.isElectron ? 'http://localhost:9095' : ''}/api/v1/nodes`;

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
        return api.get(`${Nodes.base}/`);
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
        return api.get(`${Nodes.base}/${name}`, { params: { sortBy, offset, pageSize } });
    }
}

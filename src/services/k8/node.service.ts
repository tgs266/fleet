/* eslint-disable object-shorthand */
import { AxiosResponse } from 'axios';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Node, NodeMeta } from '../../models/node.model';
import api from '../axios.service';

export default class Nodes {
    static base = 'http://localhost:51115/api/v1/nodes';

    static getNodes(): Promise<AxiosResponse<NodeMeta[]>> {
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

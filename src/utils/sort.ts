/* eslint-disable no-restricted-syntax */
import { TableSort } from '../components/SortableTableHeaderCell';
import { Filter } from '../models/base';

export default function getSortBy(sort: TableSort) {
    let sortBy = '';
    if (sort) {
        sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
    }
    return sortBy;
}

export function parseFilters(filters?: Filter[]) {
    if (filters) {
        const outArr = [];
        for (const filter of filters) {
            outArr.push(`${filter.property},${filter.value},${filter.operator}`);
        }
        return outArr.join('|');
    }
    return '';
}

export function groupBy(data: any[], key: string) {
    const resp: any = {};
    for (const r of data) {
        if (resp[r[key]] == null) {
            resp[r[key]] = [r];
        } else {
            resp[r[key]].push(r);
        }
    }
    return resp;
}

import { TableSort } from '../components/SortableTableHeaderCell';

export default function getSortBy(sort: TableSort) {
    let sortBy = '';
    if (sort) {
        sortBy = `${sort.sortableId},${sort.ascending ? 'a' : 'd'}`;
    }
    return sortBy;
}

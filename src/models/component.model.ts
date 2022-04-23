import { PaginationResponse } from './base';

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export const makePaginationProps = (
    pageSize: number,
    data: PaginationResponse<any>
): Pagination => ({
    page: Math.floor(data.offset / pageSize),
    pageSize,
    total: data.total,
});

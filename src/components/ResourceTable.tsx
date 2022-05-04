/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
import { Alignment } from '@blueprintjs/core';
import _ from 'lodash';
import React from 'react';
import { Filter } from '../models/base';
import SortableTableHeaderCell, { TableSort } from './SortableTableHeaderCell';
import Table, { PaginationProps } from './Table';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

export interface ColumnDefinition<T> {
    columnName: string;
    sortableId?: string;
    searchable?: boolean;
    key: string;
    alignment?: Alignment;
    columnFunction: (row: T) => JSX.Element | string;
}

export interface IResourceTableProps<T> {
    columns: ColumnDefinition<T>[];
    data: T[];
    title?: string;
    keyPath: string;
    sort: TableSort;
    onSortChange: (sort: TableSort) => void;
    onFiltersChange?: (filters: Filter[]) => void;
    filters?: Filter[];
    paginationProps: PaginationProps;
}

export const DEFAULT_SORTABLE_ID = 'name';
export const DEFAULT_SORTABLE_ASCENDING = false;
export const DEFAULT_SORTABLE_PAGE_SIZE = 20;

// eslint-disable-next-line react/prefer-stateless-function
export default class ResourceTable<T> extends React.Component<IResourceTableProps<T>, unknown> {
    render() {
        const { title, keyPath, columns, data, sort, onSortChange, paginationProps } = this.props;
        let fOps = null;
        if (this.props.filters) {
            fOps = [];
            for (const c of this.props.columns) {
                if (c.searchable) {
                    fOps.push({
                        name: c.columnName,
                        id: c.sortableId,
                    });
                }
            }
        }

        return (
            <Table title={title}>
                <TableHeader>
                    {columns.map((c, idx) => {
                        if (c.sortableId) {
                            return (
                                <SortableTableHeaderCell
                                    key={idx}
                                    sort={sort}
                                    onSortChange={onSortChange}
                                    sortableId={c.sortableId}
                                >
                                    {c.columnName}
                                </SortableTableHeaderCell>
                            );
                        }
                        return <TableCell>{c.columnName}</TableCell>;
                    })}
                </TableHeader>
                <TableBody
                    filterOptions={fOps}
                    onFilterAdd={(f) => {
                        this.props.filters.push(f);
                        this.props.onFiltersChange(this.props.filters);
                    }}
                    onFilterRemove={(idx) => {
                        this.props.filters.splice(idx, 1);
                        this.props.onFiltersChange(this.props.filters);
                    }}
                    filters={this.props.filters}
                    paginationProps={paginationProps}
                >
                    {data.map((row) => (
                        <TableRow key={_.get(row, keyPath)}>
                            {columns.map((c) => (
                                <TableCell alignment={c.alignment} key={c.key}>
                                    {c.columnFunction(row)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }
}

/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
import { Alignment, Button, Colors, InputGroup } from '@blueprintjs/core';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Filter } from '../models/base';
import NamespaceSelect from './NamespaceSelect';
import SortableTableHeaderCell, { TableSort } from './SortableTableHeaderCell';
import Table, { PaginationProps } from './Table';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

export interface ColumnDefinition<T> {
    type?: string;
    columnName: string;
    columnElement?: JSX.Element;
    sortableId?: string;
    searchable?: boolean;
    key: string;
    alignment?: Alignment;
    columnFunction: (row: T) => JSX.Element | string;
}

export interface IResourceTableProps<T> {
    columns: ColumnDefinition<T>[];
    lockedNamespace?: string;
    namespaced?: boolean;
    data: T[];
    title?: string;
    keyPath: string;
    sort?: TableSort;
    onSortChange?: (sort: TableSort) => void;
    onFiltersChange?: (filters: Filter[]) => void;
    filters?: Filter[];
    paginationProps?: PaginationProps;
}

export const DEFAULT_SORTABLE_ID = 'name';
export const DEFAULT_SORTABLE_ASCENDING = false;
export const DEFAULT_SORTABLE_PAGE_SIZE = 20;

const getStyles = (idx: number, cols: ColumnDefinition<any>[]) => {
    const c = cols[idx];
    const style: React.CSSProperties = {};
    if (c.type === 'icon') {
        style.width = '16px';
    }
    if (idx === 1 && cols[idx - 1].type === 'icon') {
        style.paddingLeft = 0;
    }
    return style;
};

// eslint-disable-next-line react/prefer-stateless-function
export default function ResourceTable<T>(props: IResourceTableProps<T>) {
    const { title, keyPath, columns, data, sort, onSortChange, paginationProps } = props;
    let fOps = null;
    if (props.filters) {
        fOps = [];
        for (const c of props.columns) {
            if (c.searchable) {
                fOps.push({
                    name: c.columnName,
                    id: c.sortableId,
                });
            }
        }
    }

    const [selectedNs, setSelectedNsInner] = useState(localStorage.getItem('namespace') || '_all_');
    const ref = React.useRef<HTMLInputElement>();

    const setSelectedNs = (ns: string) => {
        setSelectedNsInner(ns);
        localStorage.setItem('namespace', ns);
    };

    const setFilters = () => {
        if (!props.onFiltersChange) {
            return;
        }
        const filters = [];
        if (ref.current && ref.current.value) {
            filters.push({
                property: 'name',
                operator: 'in',
                value: ref.current.value,
            });
        }
        if (props.namespaced) {
            filters.push({
                property: 'namespace',
                operator: 'eq',
                value: selectedNs,
            });
        }
        props.onFiltersChange(filters);
    };

    useEffect(() => {
        setFilters();
    }, [selectedNs]);

    return (
        <>
            <div
                style={{
                    padding: '1em',
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: `1px solid ${Colors.LIGHT_GRAY1}`,
                }}
            >
                {title}
                <div style={{ flexGrow: 1 }} />
                {props.namespaced && props.onFiltersChange && (
                    <NamespaceSelect
                        lockedNamespace={props.lockedNamespace}
                        style={{ width: '160px', marginRight: '1em' }}
                        allowAll
                        selected={selectedNs}
                        setSelected={setSelectedNs}
                    />
                )}
                {props.onFiltersChange && (
                    <InputGroup
                        rightElement={
                            <Button
                                minimal
                                icon="small-cross"
                                onClick={() => {
                                    ref.current.value = '';
                                    setFilters();
                                }}
                            />
                        }
                        inputRef={ref}
                        style={{ width: '160px' }}
                        placeholder="Search..."
                        onChange={setFilters}
                    />
                )}
            </div>
            <Table>
                <TableHeader>
                    {columns.map((c, idx) => {
                        const styles = getStyles(idx, columns);
                        if (c.sortableId) {
                            return (
                                <SortableTableHeaderCell
                                    key={idx}
                                    sort={sort}
                                    onSortChange={onSortChange}
                                    sortableId={c.sortableId}
                                    alignment={c.alignment}
                                    style={styles}
                                >
                                    {c.columnName}
                                </SortableTableHeaderCell>
                            );
                        }
                        if (c.columnElement) {
                            return (
                                <TableCell key={idx} style={styles} head alignment={c.alignment}>
                                    {c.columnElement}
                                </TableCell>
                            );
                        }
                        return (
                            <TableCell key={idx} style={styles} head alignment={c.alignment}>
                                {c.columnName}
                            </TableCell>
                        );
                    })}
                </TableHeader>
                <TableBody paginationProps={paginationProps}>
                    {data.map((row) => (
                        <TableRow key={_.get(row, keyPath)}>
                            {columns.map((c, idx) => {
                                const styles = getStyles(idx, columns);
                                return (
                                    <TableCell
                                        style={styles}
                                        head={idx === 1}
                                        scope="row"
                                        alignment={c.alignment}
                                        key={c.key}
                                    >
                                        {c.columnFunction(row)}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

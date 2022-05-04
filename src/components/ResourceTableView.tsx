/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import { AxiosResponse } from 'axios';
import React from 'react';
import { BaseMeta, Filter, PaginationResponse } from '../models/base';
import { Pagination } from '../models/component.model';
import K8 from '../services/k8.service';
import getOffset from '../utils/table';
import { createdAtToOrigination, createdAtToHumanReadable } from '../utils/time';
import ResourceTable, {
    ColumnDefinition,
    DEFAULT_SORTABLE_ASCENDING,
    DEFAULT_SORTABLE_ID,
    DEFAULT_SORTABLE_PAGE_SIZE,
} from './ResourceTable';
import { TableSort } from './SortableTableHeaderCell';

interface IResourceTableViewProps<T extends BaseMeta> extends Pagination {
    items: T[];
    sort: TableSort;
    pollId: NodeJS.Timer;
    filters: Filter[];
}

class ResourceTableView<P, T extends BaseMeta> extends React.Component<
    P,
    IResourceTableViewProps<T>
> {
    itemsFcn: (...args: any) => Promise<AxiosResponse<PaginationResponse<T>>> = null;

    useFilters: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            items: [],
            sort: {
                sortableId: DEFAULT_SORTABLE_ID,
                ascending: DEFAULT_SORTABLE_ASCENDING,
            },
            filters: [],
            page: 0,
            pageSize: DEFAULT_SORTABLE_PAGE_SIZE,
            total: null,
            pollId: null,
        };
    }

    componentDidMount() {
        this.itemsFcn(...this._getPullParametersWrap()).then((r) => {
            this.setState({
                items: r.data.items,
                total: r.data.total,
                pollId: K8.pollFunction(5000, () => this.pull(null, null)),
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    getNameColumn = () => ({
        key: 'name',
        columnName: 'Name',
        sortableId: 'name',
        columnFunction: (row: T) => row.name,
    });

    getAgeColumn = () => ({
        key: 'age',
        columnName: 'Age',
        sortableId: 'created_at',
        columnFunction: (row: T) => (
            <Tooltip2
                className={Classes.TOOLTIP2_INDICATOR}
                content={createdAtToOrigination(row.createdAt)}
            >
                {createdAtToHumanReadable(row.createdAt)}
            </Tooltip2>
        ),
    });

    getColumns = (): ColumnDefinition<T>[] => [this.getNameColumn(), this.getAgeColumn()];

    getPullParameters = (sort?: TableSort, page?: number): any[] => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return [
            usingSort,
            getOffset(usingPage, this.state.pageSize, this.state.total),
            this.state.pageSize,
        ];
    };

    _getPullParametersWrap = (sort?: TableSort, page?: number): any[] => {
        const arr = this.getPullParameters(sort, page);
        if (this.useFilters) {
            arr.push(this.state.filters);
        }
        return arr;
    };

    setStateFromResponse = (response: PaginationResponse<T>, sort?: TableSort, page?: number) => {
        this.setState({
            items: response.items,
            sort: sort || this.state.sort,
            page: page || this.state.page,
            total: response.total,
        });
    };

    pull = (sort?: TableSort, page?: number) => {
        const params = this._getPullParametersWrap(sort, page);
        this.itemsFcn(...params).then((r) => {
            this.setStateFromResponse(r.data);
        });
    };

    sortChange = (sort: TableSort) => {
        this.setState({ sort }, () => this.pull(null, null));
        // this.pull(sort, null);
    };

    setPage = (page: number) => {
        this.setState({ page }, () => this.pull(null, null));
        // this.pull(null, page);
    };

    onFilterChange = (filters: Filter[]) => {
        this.setState({ filters }, () => this.pull(null, null));
    };

    getResourceTable = () => (
        <Card style={{ padding: 0, minWidth: '40em' }}>
            <ResourceTable<T>
                paginationProps={{
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onPageChange: this.setPage,
                }}
                filters={this.useFilters ? this.state.filters : null}
                onFiltersChange={this.useFilters ? this.onFilterChange : null}
                onSortChange={this.sortChange}
                sort={this.state.sort}
                data={this.state.items}
                keyPath="uid"
                columns={this.getColumns()}
            />
        </Card>
    );

    render() {
        return <div>{this.getResourceTable()}</div>;
    }
}

export default ResourceTableView;

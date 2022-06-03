/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import { AxiosResponse } from 'axios';
import React from 'react';
import { Filter, PaginationResponse } from '../models/base';
import { Pagination } from '../models/component.model';
import { ResourceListParams } from '../services/k8/resource.service';
import getOffset from '../utils/table';
import { createdAtToOrigination, createdAtToHumanReadable } from '../utils/time';
import ResourceTable, {
    ColumnDefinition,
    DEFAULT_SORTABLE_ASCENDING,
    DEFAULT_SORTABLE_ID,
    DEFAULT_SORTABLE_PAGE_SIZE,
} from './ResourceTable';
import { TableSort } from './SortableTableHeaderCell';

export interface IResourceTableViewState<T> extends Pagination {
    items: T[];
    sort: TableSort;
    pollId: NodeJS.Timer;
    filters: Filter[];
}

export interface IResourceTableViewProps {
    lockedNamespace?: string;
    hotkeys?: boolean;
}

class ResourceTableView<
    P extends IResourceTableViewProps,
    T extends { name: string; createdAt?: number }
> extends React.Component<P, IResourceTableViewState<T>> {
    itemsFcn: (lp?: ResourceListParams) => Promise<AxiosResponse<PaginationResponse<T>>> = null;

    useFilters: boolean = false;

    namespaced: boolean = false;

    useSearch: boolean = true;

    title: string = null;

    keypath: string = 'uid';

    constructor(props: any) {
        super(props);
        this.state = {
            items: null,
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
        this.itemsFcn(this._getPullParametersWrap()).then((r) => {
            this.setState({
                items: r.data.items,
                total: r.data.total,
            });
        });
    }

    componentWillUnmount() {
        if (this.state.pollId) {
            clearInterval(this.state.pollId);
        }
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

    getPullParameters = (sort?: TableSort, page?: number): ResourceListParams => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return {
            sort: usingSort,
            offset: getOffset(usingPage, this.state.pageSize, this.state.total),
            pageSize: this.state.pageSize,
        };
    };

    _getPullParametersWrap = (sort?: TableSort, page?: number): ResourceListParams => {
        const data = this.getPullParameters(sort, page);
        if (this.useFilters) {
            return {
                ...data,
                filters: this.state.filters,
            };
        }
        return data;
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
        this.itemsFcn(params).then((r) => {
            this.setStateFromResponse(r.data);
        });
    };

    sortChange = (sort: TableSort) => {
        this.setState({ sort }, () => this.pull(null, null));
    };

    setPage = (page: number) => {
        this.setState({ page }, () => this.pull(null, null));
    };

    onFilterChange = (filters: Filter[]) => {
        this.setState({ filters }, () => this.pull(null, null));
    };

    getResourceTable = () => (
        <Card style={{ padding: 0, minWidth: '40em' }}>
            <ResourceTable<T>
                title={this.title}
                hotkeys={this.props.hotkeys}
                lockedNamespace={this.props.lockedNamespace}
                namespaced={this.namespaced}
                paginationProps={{
                    page: this.state.page,
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onPageChange: this.setPage,
                }}
                useSearch={this.useSearch}
                filters={this.useFilters ? this.state.filters : null}
                onFiltersChange={this.useFilters ? this.onFilterChange : null}
                onSortChange={this.sortChange}
                sort={this.state.sort}
                data={this.state.items}
                keyPath={this.keypath}
                columns={this.getColumns()}
            />
        </Card>
    );

    render() {
        return <div>{this.getResourceTable()}</div>;
    }
}

export default ResourceTableView;

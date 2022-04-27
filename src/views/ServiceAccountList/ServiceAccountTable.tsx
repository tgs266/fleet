/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTable from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Pagination } from '../../models/component.model';
import { ServiceAccountMeta } from '../../models/serviceaccount.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IServiceAccountTableTableState extends Pagination {
    serviceAccounts: ServiceAccountMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

interface IServiceAccountTableProps {
    namespace?: string;
}

class ServiceAccountTable extends React.Component<
    IServiceAccountTableProps,
    IServiceAccountTableTableState
> {
    constructor(props: IServiceAccountTableProps) {
        super(props);
        this.state = {
            serviceAccounts: [],
            sort: {
                sortableId: 'name',
                ascending: false,
            },
            page: 0,
            pageSize: 10,
            total: null,
            pollId: null,
        };
    }

    componentDidMount() {
        K8.serviceAccounts
            .getServiceAccounts(this.props.namespace, this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    serviceAccounts: response.data.items,
                    total: response.data.total,
                    pollId: K8.pollFunction(5000, () => this.pull(null, null)),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    pull = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;
        K8.serviceAccounts
            .getServiceAccounts(
                this.props.namespace,
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    serviceAccounts: response.data.items,
                    sort: usingSort,
                    page: usingPage,
                    total: response.data.total,
                });
            });
    };

    sortChange = (sort: TableSort) => {
        this.pull(sort, null);
    };

    setPage = (page: number) => {
        this.pull(null, page);
    };

    render() {
        return (
            <Card style={{ padding: 0, minWidth: '40em' }}>
                <ResourceTable<ServiceAccountMeta>
                    paginationProps={{
                        page: this.state.page,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onPageChange: this.setPage,
                    }}
                    onSortChange={this.sortChange}
                    sort={this.state.sort}
                    data={this.state.serviceAccounts}
                    keyPath="uid"
                    columns={[
                        {
                            key: 'name',
                            columnName: 'Name',
                            sortableId: 'name',
                            columnFunction: (row: ServiceAccountMeta) => row.name,
                        },
                        {
                            key: 'namespace',
                            columnName: 'Namespace',
                            sortableId: 'namespace',
                            columnFunction: (row: ServiceAccountMeta) => (
                                <Link to={buildLinkToNamespace(row.namespace)}>
                                    {row.namespace}
                                </Link>
                            ),
                        },
                        {
                            key: 'age',
                            columnName: 'Age',
                            sortableId: 'created_at',
                            columnFunction: (row: ServiceAccountMeta) => (
                                <Tooltip2
                                    className={Classes.TOOLTIP2_INDICATOR}
                                    content={createdAtToOrigination(row.createdAt)}
                                >
                                    {createdAtToHumanReadable(row.createdAt)}
                                </Tooltip2>
                            ),
                        },
                    ]}
                />
            </Card>
        );
    }
}

export default ServiceAccountTable;

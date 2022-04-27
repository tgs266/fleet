/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ResourceTable from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Text from '../../components/Text/Text';
import { ClusterRoleMeta } from '../../models/clusterrole.model';
import { Pagination } from '../../models/component.model';
import K8 from '../../services/k8.service';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IClusterRoleTableState extends Pagination {
    roles: ClusterRoleMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

class ClusterRoleTable extends React.Component<unknown, IClusterRoleTableState> {
    constructor(props: any) {
        super(props);
        this.state = {
            roles: [],
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
        K8.clusterRoles
            .getClusterRoles(this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    roles: response.data.items,
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
        K8.clusterRoles
            .getClusterRoles(
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    roles: response.data.items,
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
            <div>
                <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                    Cluster Roles
                </Text>
                <Card style={{ padding: 0, minWidth: '40em' }}>
                    <ResourceTable<ClusterRoleMeta>
                        paginationProps={{
                            page: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onPageChange: this.setPage,
                        }}
                        onSortChange={this.sortChange}
                        sort={this.state.sort}
                        data={this.state.roles}
                        keyPath="uid"
                        columns={[
                            {
                                key: 'name',
                                columnName: 'Name',
                                sortableId: 'name',
                                columnFunction: (row: ClusterRoleMeta) => row.name,
                            },
                            {
                                key: 'age',
                                columnName: 'Age',
                                sortableId: 'created_at',
                                columnFunction: (row: ClusterRoleMeta) => (
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
            </div>
        );
    }
}

export default ClusterRoleTable;

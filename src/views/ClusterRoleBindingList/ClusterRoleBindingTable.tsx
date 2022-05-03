/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTable, {
    DEFAULT_SORTABLE_ASCENDING,
    DEFAULT_SORTABLE_ID,
    DEFAULT_SORTABLE_PAGE_SIZE,
} from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Text from '../../components/Text/Text';
import { ClusterRoleBindingMeta } from '../../models/clusterrole.model';
import { Pagination } from '../../models/component.model';
import K8 from '../../services/k8.service';
import { buildLinkToClusterRoleBinding } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IClusterRoleBindingTableState extends Pagination {
    bindings: ClusterRoleBindingMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

class ClusterRoleBindingTable extends React.Component<unknown, IClusterRoleBindingTableState> {
    constructor(props: any) {
        super(props);
        this.state = {
            bindings: [],
            sort: {
                sortableId: DEFAULT_SORTABLE_ID,
                ascending: DEFAULT_SORTABLE_ASCENDING,
            },
            page: 0,
            pageSize: DEFAULT_SORTABLE_PAGE_SIZE,
            total: null,
            pollId: null,
        };
    }

    componentDidMount() {
        K8.clusterRoleBindings
            .getClusterRoleBindings(this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    bindings: response.data.items,
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
        K8.clusterRoleBindings
            .getClusterRoleBindings(
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    bindings: response.data.items,
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
                    Cluster Role Bindings
                </Text>
                <Card style={{ padding: 0, minWidth: '40em' }}>
                    <ResourceTable<ClusterRoleBindingMeta>
                        paginationProps={{
                            page: this.state.page,
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onPageChange: this.setPage,
                        }}
                        onSortChange={this.sortChange}
                        sort={this.state.sort}
                        data={this.state.bindings}
                        keyPath="uid"
                        columns={[
                            {
                                key: 'name',
                                columnName: 'Name',
                                sortableId: 'name',
                                columnFunction: (row: ClusterRoleBindingMeta) => (
                                    <Link to={buildLinkToClusterRoleBinding(row.name)}>
                                        {row.name}
                                    </Link>
                                ),
                            },
                            {
                                key: 'age',
                                columnName: 'Age',
                                sortableId: 'created_at',
                                columnFunction: (row: ClusterRoleBindingMeta) => (
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

export default ClusterRoleBindingTable;

/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ResourceTableView from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Link from '../../layouts/Link';
import { ClusterRoleBindingMeta } from '../../models/clusterrole.model';
import K8 from '../../services/k8.service';
import { buildLinkToClusterRoleBinding } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

class ClusterRoleBindingTable extends ResourceTableView<unknown, ClusterRoleBindingMeta> {
    itemsFcn = K8.clusterRoleBindings.list.bind(K8.clusterRoleBindings);

    useFilters = true;

    title = 'Cluster Role Bindings';

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return {
            sort: usingSort,
            offset: getOffset(usingPage, this.state.pageSize, this.state.total),
            pageSize: this.state.pageSize,
        };
    };

    getColumns = () => [
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'name',
            searchable: true,
            columnFunction: (row: ClusterRoleBindingMeta) => (
                <Link to={buildLinkToClusterRoleBinding(row.name)}>{row.name}</Link>
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
    ];
}

export default ClusterRoleBindingTable;

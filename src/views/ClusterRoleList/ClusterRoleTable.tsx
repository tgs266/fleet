/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTableView from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { ClusterRoleMeta } from '../../models/clusterrole.model';
import K8 from '../../services/k8.service';
import { buildLinkToClusterRole } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

class ClusterRoleTable extends ResourceTableView<unknown, ClusterRoleMeta> {
    itemsFcn = K8.clusterRoles.getClusterRoles;

    useFilters = true;

    title = 'Cluster Roles';

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return [
            usingSort,
            getOffset(usingPage, this.state.pageSize, this.state.total),
            this.state.pageSize,
        ];
    };

    getColumns = () => [
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'na]me',
            searchable: true,
            columnFunction: (row: ClusterRoleMeta) => (
                <Link to={buildLinkToClusterRole(row.name)}>{row.name}</Link>
            ),
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
    ];
}

export default ClusterRoleTable;

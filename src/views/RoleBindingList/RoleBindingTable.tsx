/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ResourceTableView, { IResourceTableViewProps } from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Link from '../../layouts/Link';
import { RoleBindingMeta } from '../../models/role.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToRoleBinding } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IRoleBindingTableProps extends IResourceTableViewProps {
    namespace?: string;
}

class RoleBindingTable extends ResourceTableView<IRoleBindingTableProps, RoleBindingMeta> {
    itemsFcn = K8.roleBindings.list.bind(K8.roleBindings);

    useFilters = true;

    title = 'Role Bindings';

    namespaced = true;

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return {
            namespace: this.props.namespace,
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
            columnFunction: (row: RoleBindingMeta) => (
                <Link to={buildLinkToRoleBinding(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            columnName: 'Namespace',
            sortableId: 'namespace',
            searchable: true,
            columnFunction: (row: RoleBindingMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'age',
            columnName: 'Age',
            sortableId: 'created_at',
            columnFunction: (row: RoleBindingMeta) => (
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

export default RoleBindingTable;

/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTableView from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Text from '../../components/Text/Text';
import { RoleMeta } from '../../models/role.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToRole } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

export interface IRoleTableProps {
    namespace?: string;
}

class RoleTable extends ResourceTableView<IRoleTableProps, RoleMeta> {
    itemsFcn = K8.roles.getRoles;

    useFilters = true;

    getPullParameters = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;

        return [
            this.props.namespace,
            usingSort,
            getOffset(usingPage, this.state.pageSize, this.state.total),
            this.state.pageSize,
        ];
    };

    getColumns = () => [
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'name',
            searchable: true,
            columnFunction: (row: RoleMeta) => (
                <Link to={buildLinkToRole(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            columnName: 'Namespace',
            sortableId: 'namespace',
            searchable: true,
            columnFunction: (row: RoleMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'age',
            columnName: 'Age',
            sortableId: 'created_at',
            columnFunction: (row: RoleMeta) => (
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(row.createdAt)}
                >
                    {createdAtToHumanReadable(row.createdAt)}
                </Tooltip2>
            ),
        },
    ];

    render() {
        return (
            <div>
                <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                    Roles
                </Text>
                {this.getResourceTable()}
            </div>
        );
    }
}

export default RoleTable;

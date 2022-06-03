/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTableView, { IResourceTableViewProps } from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { ServiceAccountMeta } from '../../models/serviceaccount.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToServiceAccount } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IServiceAccountTableProps extends IResourceTableViewProps {
    namespace?: string;
}

class ServiceAccountTable extends ResourceTableView<IServiceAccountTableProps, ServiceAccountMeta> {
    itemsFcn = K8.serviceAccounts.list.bind(K8.serviceAccounts);

    useFilters = true;

    title = 'Service Accounts';

    namespaced = true;

    getColumns = () => [
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'name',
            searchable: true,
            columnFunction: (row: ServiceAccountMeta) => (
                <Link to={buildLinkToServiceAccount(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            columnName: 'Namespace',
            sortableId: 'namespace',
            searchable: true,
            columnFunction: (row: ServiceAccountMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
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
    ];

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
}

export default ServiceAccountTable;

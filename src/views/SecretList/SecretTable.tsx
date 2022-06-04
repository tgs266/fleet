/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ResourceTableView, { IResourceTableViewProps } from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Link from '../../layouts/Link';
import { SecretMeta } from '../../models/secret.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToSecret } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import { withRouter } from '../../utils/withRouter';

export interface ISecretTableProps extends IResourceTableViewProps {
    namespace?: string;
}

class SecretTable extends ResourceTableView<ISecretTableProps, SecretMeta> {
    itemsFcn = K8.secrets.list.bind(K8.secrets);

    useFilters = true;

    title = 'Secrets';

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
            sortableId: 'name',
            columnName: 'Name',
            searchable: true,
            columnFunction: (row: SecretMeta) => (
                <Link to={buildLinkToSecret(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            sortableId: 'namespace',
            columnName: 'Namespace',
            searchable: true,
            columnFunction: (row: SecretMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'age',
            sortableId: 'created_at',
            columnName: 'Age',
            columnFunction: (row: SecretMeta) => (
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(row.createdAt)}
                >
                    {createdAtToHumanReadable(row.createdAt)}
                </Tooltip2>
            ),
        },
        {
            key: 'immutable',
            columnName: 'Immutable?',
            columnFunction: (row: SecretMeta) => (row.immutable ? 'Yes' : 'No'),
        },
    ];
}

export default withRouter(SecretTable);

/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ResourceTableView, { IResourceTableViewProps } from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Link from '../../layouts/Link';
import { ServiceMeta } from '../../models/service.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToService } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IServiceTableProps extends IResourceTableViewProps {
    namespace?: string;
}
class ServiceTable extends ResourceTableView<IServiceTableProps, ServiceMeta> {
    itemsFcn = K8.services.list.bind(K8.services);

    useFilters = true;

    title = 'Services';

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
            columnFunction: (row: ServiceMeta) => (
                <Link to={buildLinkToService(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            sortableId: 'namespace',
            columnName: 'Namespace',
            searchable: true,
            columnFunction: (row: ServiceMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'age',
            sortableId: 'created_at',
            columnName: 'Age',
            columnFunction: (row: ServiceMeta) => (
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(row.createdAt)}
                >
                    {createdAtToHumanReadable(row.createdAt)}
                </Tooltip2>
            ),
        },
        {
            key: 'type',
            columnName: 'Type',
            columnFunction: (row: ServiceMeta) => row.type,
        },
    ];
}

export default ServiceTable;

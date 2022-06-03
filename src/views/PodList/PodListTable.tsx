/* eslint-disable class-methods-use-this */
import { Alignment, Icon } from '@blueprintjs/core';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import AgeText from '../../components/AgeText';
import ResourceTableView, { IResourceTableViewProps } from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { PodMeta } from '../../models/pod.model';
import K8 from '../../services/k8.service';
import { getStatusColor } from '../../utils/pods';
import { buildLinkToPod, buildLinkToNamespace, buildLinkToNode } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToOrigination } from '../../utils/time';

interface IPodTableProps extends IResourceTableViewProps {
    namespace?: string;
}

class PodListTable extends ResourceTableView<IPodTableProps, PodMeta> {
    itemsFcn = K8.pods.list.bind(K8.pods);

    useFilters = true;

    namespaced = true;

    title = 'Pods';

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
            type: 'icon',
            key: 'icon',
            alignment: Alignment.LEFT,
            columnName: '',
            columnFunction: (row: PodMeta) => {
                const statusColor = getStatusColor(row);
                const statusHtml = <Icon color={statusColor} icon="full-circle" size={14} />;
                return <Tooltip2 content={row.status.reason}>{statusHtml}</Tooltip2>;
            },
        },
        {
            key: 'name',
            columnName: 'Name',
            sortableId: 'name',
            searchable: true,
            columnFunction: (row: PodMeta) => (
                <Link to={buildLinkToPod(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            columnName: 'Namespace',
            sortableId: 'namespace',
            searchable: true,
            columnFunction: (row: PodMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'nodeName',
            columnName: 'Node Name',
            columnFunction: (row: PodMeta) => (
                <Link to={buildLinkToNode(row.nodeName)}>{row.nodeName}</Link>
            ),
        },
        {
            key: 'age',
            columnName: 'Age',
            sortableId: 'created_at',
            columnFunction: (row: PodMeta) => (
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(row.createdAt)}
                >
                    <AgeText hr value={row.createdAt} />
                </Tooltip2>
            ),
        },
        {
            key: 'restarts',
            columnName: 'Restarts',
            columnFunction: (row: PodMeta) => row.restarts.toString(),
        },
    ];
}

export default PodListTable;

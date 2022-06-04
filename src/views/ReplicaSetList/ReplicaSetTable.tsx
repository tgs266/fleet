/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-unstable-nested-components */
import { Alignment, Colors, Icon } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import ResourceTableView, { IResourceTableViewProps } from '../../components/ResourceTableView';
import { TableSort } from '../../components/SortableTableHeaderCell';
import Link from '../../layouts/Link';
import { ReplicaSetMeta } from '../../models/replicaset.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToReplicaSet } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface IReplicaSetTable extends IResourceTableViewProps {
    namespace?: string;
}
class ReplicaSetTable extends ResourceTableView<IReplicaSetTable, ReplicaSetMeta> {
    itemsFcn = K8.replicaSets.list.bind(K8.replicaSets);

    useFilters = true;

    title = 'Replica Sets';

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
            type: 'icon',
            key: 'icon',
            alignment: Alignment.LEFT,
            columnName: '',
            columnFunction: (row: ReplicaSetMeta) => {
                let color;
                switch (row.readyReplicas) {
                    case 0:
                        color = Colors.RED4;
                        break;
                    case row.replicas:
                        color = Colors.GREEN4;
                        break;
                    default:
                        color = Colors.GOLD5;
                        break;
                }
                const statusHtml = <Icon color={color} icon="full-circle" size={14} />;
                return (
                    <Tooltip2 content={`${row.readyReplicas}/${row.replicas} pods running`}>
                        {statusHtml}
                    </Tooltip2>
                );
            },
        },
        {
            key: 'name',
            sortableId: 'name',
            columnName: 'Name',
            searchable: true,
            columnFunction: (row: ReplicaSetMeta) => (
                <Link to={buildLinkToReplicaSet(row.namespace, row.name)}>{row.name}</Link>
            ),
        },
        {
            key: 'namespace',
            sortableId: 'namespace',
            columnName: 'Namespace',
            searchable: true,
            columnFunction: (row: ReplicaSetMeta) => (
                <Link to={buildLinkToNamespace(row.namespace)}>{row.namespace}</Link>
            ),
        },
        {
            key: 'age',
            sortableId: 'created_at',
            columnName: 'Age',
            columnFunction: (row: ReplicaSetMeta) => (
                <Tooltip2
                    className={Classes.TOOLTIP2_INDICATOR}
                    content={createdAtToOrigination(row.createdAt)}
                >
                    {createdAtToHumanReadable(row.createdAt)}
                </Tooltip2>
            ),
        },
        {
            key: 'pods',
            columnName: 'Pods',
            columnFunction: (row: ReplicaSetMeta) => `${row.readyReplicas}/${row.replicas}`,
        },
    ];
}

export default ReplicaSetTable;

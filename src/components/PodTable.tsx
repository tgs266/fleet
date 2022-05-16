/* eslint-disable react/no-unstable-nested-components */
import { Alignment, Icon } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { PodMeta } from '../models/pod.model';
import { getStatusColor } from '../utils/pods';
import { buildLinkToNamespace, buildLinkToNode, buildLinkToPod } from '../utils/routing';
import { createdAtToOrigination } from '../utils/time';
import AgeText from './AgeText';
import ResourceTable from './ResourceTable';
import { TableSort } from './SortableTableHeaderCell';
import { PaginationProps } from './Table';

export default function PodTable(props: {
    pods: PodMeta[];
    sort?: TableSort;
    onSortChange?: (sort: TableSort) => void;
    paginationProps?: PaginationProps;
}) {
    return (
        <ResourceTable<PodMeta>
            namespaced
            data={props.pods}
            sort={props.sort}
            keyPath="uid"
            onSortChange={props.onSortChange}
            paginationProps={props.paginationProps}
            columns={[
                {
                    key: 'icon',
                    alignment: Alignment.LEFT,
                    columnName: '',
                    columnFunction: (row: PodMeta) => {
                        const statusColor = getStatusColor(row);
                        const statusHtml = (
                            <Icon color={statusColor} icon="full-circle" size={14} />
                        );
                        return <Tooltip2 content={row.status.reason}>{statusHtml}</Tooltip2>;
                    },
                },
                {
                    key: 'name',
                    columnName: 'Name',
                    sortableId: 'name',
                    columnFunction: (row: PodMeta) => (
                        <Link to={buildLinkToPod(row.namespace, row.name)}>{row.name}</Link>
                    ),
                },
                {
                    key: 'namespace',
                    columnName: 'Namespace',
                    sortableId: 'namespace',
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
            ]}
        />
    );
}

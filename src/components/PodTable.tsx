import { Alignment, Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { TOOLTIP2_INDICATOR } from '@blueprintjs/popover2/lib/esm/classes';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { PodMeta } from '../models/pod.model';
import { getStatusColor } from '../utils/pods';
import { buildLinkToPod } from '../utils/routing';
import { createdAtToOrigination } from '../utils/time';
import AgeText from './AgeText';
import SortableTableHeaderCell, { TableSort } from './SortableTableHeaderCell';
import Table, { PaginationProps } from './Table';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

export default function PodTable(props: {
    pods: PodMeta[];
    sort?: TableSort;
    onSortChange?: (sort: TableSort) => void;
    paginationProps?: PaginationProps;
}) {
    return (
        <Table>
            <TableHeader>
                {!props.sort ? (
                    <>
                        <TableCell />
                        <TableCell>Name</TableCell>
                        <TableCell>Namespace</TableCell>
                        <TableCell>Node Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Restarts</TableCell>
                    </>
                ) : (
                    <>
                        <TableCell />
                        <SortableTableHeaderCell
                            sort={props.sort}
                            onSortChange={props.onSortChange}
                            sortableId="name"
                        >
                            Name
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                            sort={props.sort}
                            onSortChange={props.onSortChange}
                            sortableId="namespace"
                        >
                            Namespace
                        </SortableTableHeaderCell>
                        <TableCell>Node Name</TableCell>
                        <SortableTableHeaderCell
                            sort={props.sort}
                            onSortChange={props.onSortChange}
                            sortableId="createdAt"
                        >
                            Age
                        </SortableTableHeaderCell>
                        <TableCell>Restarts</TableCell>
                    </>
                )}
            </TableHeader>
            <TableBody paginationProps={props.paginationProps}>
                {props.pods.map((p) => {
                    const statusColor = getStatusColor(p);
                    const statusHtml = <Icon color={statusColor} icon="full-circle" size={14} />;
                    return (
                        <TableRow key={p.uid}>
                            <TableCell alingment={Alignment.CENTER}>
                                <Tooltip2 content={p.status.reason}>{statusHtml}</Tooltip2>
                            </TableCell>
                            <TableCell>
                                <Link to={buildLinkToPod(p.namespace, p.name)}>{p.name}</Link>
                            </TableCell>
                            <TableCell>{p.namespace}</TableCell>
                            <TableCell>{p.nodeName}</TableCell>
                            <TableCell>
                                <Tooltip2
                                    className={TOOLTIP2_INDICATOR}
                                    content={createdAtToOrigination(p.createdAt)}
                                >
                                    <AgeText hr value={p.createdAt} />
                                </Tooltip2>
                            </TableCell>
                            <TableCell>{p.restarts}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

/* eslint-disable react/no-array-index-key */
import { Card } from '@blueprintjs/core';
import React from 'react';
import { Condition } from '../models/base';
import AgeText from './AgeText';
import Table from './Table';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import TitledCard from './TitledCard';

export default function ConditionTable(props: { conditions: Condition[]; ignoreProbe?: boolean }) {
    return (
        <TitledCard title="Conditions">
            <Card style={{ padding: 0 }}>
                <Table>
                    <TableHeader>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Last Probe Time</TableCell>
                        {!props.ignoreProbe && <TableCell>Last Transition Time</TableCell>}
                        <TableCell>Reason</TableCell>
                        <TableCell>Message</TableCell>
                    </TableHeader>
                    <TableBody>
                        {props.conditions.map((cond, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{cond.type}</TableCell>
                                <TableCell>{cond.status}</TableCell>
                                {!props.ignoreProbe && (
                                    <TableCell>
                                        <AgeText value={cond.lastProbeTime} hr />
                                    </TableCell>
                                )}
                                <TableCell>
                                    <AgeText value={cond.lastTransitionTime} hr />
                                </TableCell>
                                <TableCell>
                                    {cond.reason && cond.reason !== '' ? cond.reason : '-'}
                                </TableCell>
                                <TableCell>
                                    {cond.message && cond.message !== '' ? cond.message : '-'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </TitledCard>
    );
}

/* eslint-disable indent */
import * as React from 'react';
import { Card } from '@blueprintjs/core';
import Table from '../Table';
import TableHeader from '../TableHeader';
import TableCell from '../TableCell';
import ContainerSpecTableRow from './ContainerSpecTableRow';
import { ContainerSpec } from '../../models/container.model';

export default function ContainerSpecContainer(props: {
    containerSpecs: ContainerSpec[];
    style?: React.CSSProperties;
    refresh?: () => void;
    // update: (specs: ContainerSpec[]) => void
}) {
    const { containerSpecs, style } = props;

    // TODO: investigate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onDelete = (idx: number) => {
        // props.update(containerSpecs.filter((_, idxF) => idxF !== idx))
    };

    return (
        <div style={style}>
            <Card>
                <div style={{ display: 'flex' }}>
                    <h3 style={{ margin: 0 }}>Container Specifications</h3>
                    <div style={{ flexGrow: 1 }} />
                </div>
                <Card style={{ padding: 0, marginTop: '1em' }}>
                    <Table>
                        <TableHeader>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Port(s)</TableCell>
                            <TableCell />
                        </TableHeader>
                        <tbody>
                            {containerSpecs.map((spec) => (
                                <ContainerSpecTableRow
                                    showDelete={containerSpecs.length > 1}
                                    onDelete={onDelete}
                                    refresh={props.refresh}
                                    spec={spec}
                                />
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </Card>
        </div>
    );
}

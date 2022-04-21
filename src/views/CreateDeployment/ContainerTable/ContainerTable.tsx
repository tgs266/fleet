/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Alignment, Button, Card } from '@blueprintjs/core';
import Table from '../../../components/Table';
import TableHeader from '../../../components/TableHeader';
import TableCell from '../../../components/TableCell';
import { ContainerSpec } from '../../../models/container.model';
import ContainerTableRow from './ContainerTableRow';

export default function ContainerTable(props: {
    containerSpecs: ContainerSpec[];
    addRow: () => void;
    deleteRow: (idx: number) => void;
    onChange: (path: string, value: any) => void;
}) {
    return (
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
                        <TableCell alignment={Alignment.RIGHT}>
                            <Button minimal icon="add" onClick={props.addRow} data-testid="add-new-row" />
                        </TableCell>
                    </TableHeader>
                    <tbody>
                        {props.containerSpecs.map((spec, idx) => (
                            <ContainerTableRow
                                key={idx}
                                idx={idx}
                                spec={spec}
                                deleteRow={props.deleteRow}
                                onChange={props.onChange}
                            />
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Card>
    );
}

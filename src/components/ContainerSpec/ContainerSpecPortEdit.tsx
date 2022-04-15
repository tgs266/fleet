/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Alignment, Button, Card, InputGroup, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { ContainerSpec } from '../../models/container.model';
import TableHeader from '../TableHeader';
import TableCell from '../TableCell';
import Table from '../Table';
import TableRow from '../TableRow';

export default function ContainerSpecPortEdit(props: {
    containerSpec: ContainerSpec;
    onChange: (path: string, value: any) => void;
}) {
    const { containerSpec, onChange } = props;

    return (
        <Card style={{ margin: '1em' }}>
            <h3 style={{ margin: 0 }}>Ports</h3>
            <Card style={{ padding: 0, marginTop: '1em' }}>
                <Table>
                    <TableHeader>
                        <TableCell>Host IP</TableCell>
                        <TableCell>Host Port</TableCell>
                        <TableCell>Container Port</TableCell>
                        <TableCell>Protocol</TableCell>
                        <TableCell alingment={Alignment.RIGHT}>
                            <Button
                                icon="add"
                                minimal
                                onClick={() => {
                                    onChange('ports', [
                                        ...containerSpec.ports,
                                        {
                                            hostIp: '',
                                            hostPort: 0,
                                            containerPort: 0,
                                            protocol: 'TCP',
                                        },
                                    ]);
                                }}
                            />
                        </TableCell>
                    </TableHeader>
                    <tbody>
                        {containerSpec.ports.map((port, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <InputGroup
                                        value={port.hostIp}
                                        onChange={(e) =>
                                            onChange(`ports[${idx}].hostIp`, e.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <InputGroup
                                        type="number"
                                        value={port.hostPort.toString()}
                                        onChange={(e) =>
                                            onChange(
                                                `ports[${idx}].hostPort`,
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <InputGroup
                                        type="number"
                                        value={port.containerPort.toString()}
                                        onChange={(e) =>
                                            onChange(
                                                `ports[${idx}].containerPort`,
                                                parseInt(e.target.value, 10)
                                            )
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    {/* <InputGroup defaultValue={port.protocol} onChange={(e) => onChange(`ports[${idx}].protocol`, e.target.value)}/>  */}
                                    <Suggest
                                        items={['TCP', 'UDP', 'SCTP']}
                                        selectedItem={port.protocol}
                                        inputValueRenderer={(item) => item}
                                        itemRenderer={(item, itemProps) => {
                                            if (!itemProps.modifiers.matchesPredicate) {
                                                return null;
                                            }
                                            return (
                                                <MenuItem
                                                    active={itemProps.modifiers.active}
                                                    disabled={itemProps.modifiers.disabled}
                                                    key={item}
                                                    onClick={itemProps.handleClick}
                                                    text={item}
                                                />
                                            );
                                        }}
                                        itemPredicate={(query, item, index, exactMatch) => {
                                            const normalizedTitle = item.toLowerCase();
                                            const normalizedQuery = query.toLowerCase();

                                            if (exactMatch) {
                                                return normalizedTitle === normalizedQuery;
                                            }
                                            return item.indexOf(normalizedQuery) >= 0;
                                        }}
                                        onItemSelect={(item) => {
                                            onChange(`ports[${idx}].protocol`, item);
                                        }}
                                    />
                                </TableCell>
                                <TableCell alingment={Alignment.RIGHT}>
                                    <Button
                                        icon="trash"
                                        minimal
                                        onClick={() => {
                                            onChange(
                                                'ports',
                                                containerSpec.ports.filter(
                                                    (_, idx2) => idx !== idx2
                                                )
                                            );
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Card>
    );
}

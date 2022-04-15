/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Alignment, Button, Card, InputGroup } from '@blueprintjs/core';
import { ContainerSpec } from '../../models/container.model';
import TableHeader from '../../components/TableHeader';
import TableCell from '../../components/TableCell';
import Table from '../../components/Table';
import TableRow from '../../components/TableRow';

export default function ContainerSpecEnvVarEdit(props: {
    containerSpec: ContainerSpec;
    onChange: (path: string, value: any) => void;
}) {
    const { containerSpec, onChange } = props;

    return (
        <Card style={{ margin: '1em' }}>
            <h3 style={{ margin: 0 }}>Environment Variables</h3>
            <Card style={{ padding: 0, marginTop: '1em' }}>
                <Table>
                    <TableHeader>
                        <TableCell>Name</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell alingment={Alignment.RIGHT}>
                            <Button
                                icon="add"
                                minimal
                                onClick={() => {
                                    onChange('envVars', [
                                        ...containerSpec.ports,
                                        {
                                            name: '',
                                            value: '',
                                        },
                                    ]);
                                }}
                            />
                        </TableCell>
                    </TableHeader>
                    <tbody>
                        {containerSpec.envVars.map((env, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <InputGroup
                                        value={env.name}
                                        onChange={(e) =>
                                            onChange(`envVars[${idx}].name`, e.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <InputGroup
                                        value={env.value}
                                        onChange={(e) =>
                                            onChange(`envVars[${idx}].value`, e.target.value)
                                        }
                                    />
                                </TableCell>
                                <TableCell alingment={Alignment.RIGHT}>
                                    <Button
                                        icon="trash"
                                        minimal
                                        onClick={() => {
                                            onChange(
                                                'envVars',
                                                containerSpec.envVars.filter(
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

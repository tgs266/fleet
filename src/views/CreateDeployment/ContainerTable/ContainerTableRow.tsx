/* eslint-disable indent */
import * as React from 'react';
import { Alignment, Button, Collapse, InputGroup } from '@blueprintjs/core';
import TableCell from '../../../components/TableCell';
import { ContainerSpec } from '../../../models/container.model';
import TableRow from '../../../components/TableRow';
import ContainerSpecPortEdit from '../../../components/ContainerSpec/ContainerSpecPortEdit';
import ImageList from '../../../components/ImageList';
import ContainerSpecResourceEdit from '../../../components/ContainerSpec/ContainerSpecResourceEdit';

// delete button
export default function ContainerTableRow(props: {
    spec: ContainerSpec;
    idx: number;
    onChange: (path: string, value: any) => void;
    deleteRow: (idx: number) => void;
}) {
    const { spec, onChange } = props;
    const [isOpen, setIsOpen] = React.useState(false);
    const innerOnChange = (path: string, value: any) => {
        onChange(`[${props.idx}].${path}`, value);
    };
    return (
        <>
            <TableRow>
                <TableCell>
                    <InputGroup
                        fill
                        data-testid={`${props.idx}-row-name-input`}
                        value={spec.name}
                        onChange={(e) => {
                            innerOnChange('name', e.target.value);
                        }}
                    />
                </TableCell>
                <TableCell>
                    <ImageList onChange={innerOnChange} containerSpec={spec} />
                </TableCell>
                <TableCell alignment={Alignment.RIGHT}>
                    <Button
                        minimal
                        icon={isOpen ? 'arrow-up' : 'arrow-down'}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                    <Button minimal icon="trash" onClick={() => props.deleteRow(props.idx)} />
                </TableCell>
            </TableRow>
            <TableRow />
            <TableRow>
                <TableCell style={{ paddingTop: '0', paddingBottom: '0' }} colspan={100}>
                    <Collapse isOpen={isOpen}>
                        <ContainerSpecPortEdit containerSpec={spec} onChange={innerOnChange} />
                        <ContainerSpecResourceEdit containerSpec={spec} onChange={innerOnChange} />
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

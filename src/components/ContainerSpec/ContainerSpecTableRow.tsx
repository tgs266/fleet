/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
import * as React from 'react';
import { Button, Alignment, Menu, Position, MenuItem } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router';
import { ContainerSpec } from '../../models/container.model';
import { buildLinkToContainerSpec } from '../../utils/routing';
import TableRow from '../TableRow';
import TableCell from '../TableCell';
import PortTags from '../Port/PortTags';
import ContainerSpecUpdateDialog from './ContainerSpecUpdateDialog';

export default function ContainerSpecTableRow(props: {
    spec: ContainerSpec;
    showDelete: boolean;
    onDelete: (idx: number) => void;
    refresh: () => void;
}) {
    const { spec } = props;
    const nav = useNavigate();
    const params = useParams();
    const [updateModalOpen, setUpdateModalOpen] = React.useState(false);

    // TODO: investigate
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const onSuccess = (changedSpec: ContainerSpec) => {
        // K8.deployments.updateContainerSpec(params.deployment, params.namespace, spec.name, changedSpec).then(() => {
        //     setUpdateModalOpen(false)
        props.refresh();
        // })
    };

    const target = buildLinkToContainerSpec(params.deployment, params.namespace, spec.name);

    return (
        <>
            <ContainerSpecUpdateDialog
                spec={spec}
                isOpen={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                onSuccess={onSuccess}
            />
            <TableRow key={spec.name}>
                <TableCell>
                    <Link to={target}>{spec.name}</Link>
                </TableCell>
                <TableCell>
                    {spec.image.name}:{spec.image.tag}
                </TableCell>
                <TableCell>
                    <PortTags ports={spec.ports} />
                </TableCell>
                <TableCell alignment={Alignment.RIGHT}>
                    {props.showDelete && (
                        <Button
                            icon="trash"
                            minimal
                            onClick={() => {
                                props.onDelete(0);
                            }}
                        />
                    )}
                    <Popover2
                        position={Position.BOTTOM_LEFT}
                        content={
                            <Menu>
                                <MenuItem
                                    icon="edit"
                                    text="Edit Container Spec"
                                    onClick={() => nav(target)}
                                />
                            </Menu>
                        }
                    >
                        <Button icon="more" minimal />
                    </Popover2>
                </TableCell>
            </TableRow>
        </>
    );
}

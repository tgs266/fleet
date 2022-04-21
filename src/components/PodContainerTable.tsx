/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
import { Alignment, Button, Card, Collapse, Colors, Icon, Menu, MenuItem } from '@blueprintjs/core';
import { Popover2, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Table from './Table';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import { Container, ContainerSpec } from '../models/container.model';
import { Pod } from '../models/pod.model';
import { buildLinkToContainer } from '../utils/routing';
import { BytesTo } from '../utils/conversions';
import ContainerSpecContainer from './ContainerSpec/ContainerSpecContainer';

export default function PodContainerTable(props: { pod: Pod; accordion?: boolean }) {
    const getColor = (cont: Container) => {
        switch (cont.state) {
            case 'Running':
                return Colors.GREEN4;
            case 'Waiting':
                return Colors.GOLD5;
            case 'Failed':
                return Colors.RED4;
            case 'Unknown':
                return Colors.GRAY4;
            default:
                return Colors.RED4;
        }
    };

    const params = useParams();
    const nav = useNavigate();

    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Card style={{ padding: 0 }}>
            <Table>
                <TableHeader>
                    <TableCell>Name</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>CPU Usage</TableCell>
                    <TableCell>Memory Usage</TableCell>
                    <TableCell />
                </TableHeader>
                <tbody>
                    {props.pod.containers.map((container) => {
                        const containerLink = buildLinkToContainer(
                            params.namespace,
                            props.pod.name,
                            container.name
                        );
                        return (
                            <>
                                <TableRow key={container.name}>
                                    <TableCell>
                                        <Link to={containerLink}>{container.name}</Link>
                                    </TableCell>
                                    <TableCell>
                                        {container.image.name}:{container.image.tag}
                                    </TableCell>
                                    <TableCell>
                                        {container.cpuUsage ? container.cpuUsage : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {container.memUsage
                                            ? `${BytesTo.megabytes(container.memUsage).toFixed(
                                                  2
                                              )} MB`
                                            : '-'}
                                    </TableCell>
                                    <TableCell alignment={Alignment.RIGHT}>
                                        <Tooltip2 content={`Status: ${container.state}`}>
                                            <Icon
                                                style={{ marginRight: '1em' }}
                                                icon="full-circle"
                                                color={getColor(container)}
                                                size={14}
                                            />
                                        </Tooltip2>
                                        {props.accordion && (
                                            <Button
                                                icon="arrow-down"
                                                minimal
                                                onClick={() => {
                                                    setIsOpen(!isOpen);
                                                }}
                                            />
                                        )}
                                        <Popover2
                                            content={
                                                <Menu>
                                                    <MenuItem
                                                        text="Inspect"
                                                        icon="eye-open"
                                                        onClick={() => {
                                                            nav(containerLink);
                                                        }}
                                                    />
                                                </Menu>
                                            }
                                        >
                                            <Button icon="more" minimal />
                                        </Popover2>
                                    </TableCell>
                                </TableRow>
                                {props.accordion && (
                                    <>
                                        <TableRow />
                                        <TableRow>
                                            <TableCell
                                                style={{ paddingTop: '0', paddingBottom: '0' }}
                                                colspan={100}
                                            >
                                                <Collapse isOpen={isOpen}>
                                                    <ContainerSpecContainer
                                                        refresh={() => {}}
                                                        style={{ margin: '1em', marginTop: 0 }}
                                                        containerSpecs={
                                                            props.pod.containers as ContainerSpec[]
                                                        }
                                                    />
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )}
                            </>
                        );
                    })}
                </tbody>
            </Table>
        </Card>
    );
}

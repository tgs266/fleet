/* eslint-disable indent */
import * as React from 'react';
import { Colors, Card, Button, Position, Menu, MenuItem } from '@blueprintjs/core';
import { Classes, Popover2, Tooltip2 } from '@blueprintjs/popover2';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import Accordion from '../../components/Accordion';
import { Service } from '../../models/service.model';
import Table from '../../components/Table';
import TableHeader from '../../components/TableHeader';
import TableCell from '../../components/TableCell';
import TableRow from '../../components/TableRow';
import { buildLinkToService } from '../../utils/routing';
import Link from '../../layouts/Link';

const createAccordionTitle = (service: Service): JSX.Element => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexBasis: '45%', marginRight: '0.5%' }}>
            <Link to={buildLinkToService(service.namespace, service.name)}>{service.name}</Link>
        </div>
        <div style={{ flexBasis: '27.5%', marginRight: '0.5%', marginLeft: '0.5%' }}>
            <Tooltip2
                className={Classes.TOOLTIP2_INDICATOR}
                content={createdAtToOrigination(service.createdAt)}
            >
                <div>Age: {createdAtToHumanReadable(service.createdAt)}</div>
            </Tooltip2>
        </div>
        <div style={{ flexBasis: '27.5%', marginRight: '1em', marginLeft: '0.5%' }}>
            Type: {service.type}
        </div>
    </div>
);

export default function DeploymentServiceContainer(props: {
    services: Service[];
    style?: React.CSSProperties;
}) {
    const { services, style } = props;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const menu = (_service: Service) => (
        <Menu>
            <MenuItem icon="eye-open" text="Inspect" />
            <MenuItem icon="reset" text="Restart" />
        </Menu>
    );

    return (
        <div style={style}>
            <Card style={{ borderRadius: '3px 3px 0px 0px' }}>
                <div style={{ display: 'flex' }}>
                    <h3 style={{ margin: 0 }}>Services</h3>
                    <div style={{ flexGrow: 1 }} />
                    <h3 style={{ margin: 0 }}>{services.length}</h3>
                </div>
            </Card>
            {services.map((service) => (
                <Accordion
                    key={service.uid}
                    className="pod-container-child"
                    title={createAccordionTitle(service)}
                    rightElement={
                        <Popover2 content={menu(service)} position={Position.BOTTOM_LEFT}>
                            <Button minimal style={{ marginLeft: '0.5em' }} icon="more" />
                        </Popover2>
                    }
                >
                    <Card style={{ padding: 0, backgroundColor: Colors.LIGHT_GRAY4 }}>
                        <div style={{ margin: '5px 0' }}>
                            <Card style={{ padding: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableCell>Port Name</TableCell>
                                        <TableCell>Node Port</TableCell>
                                        <TableCell>Target Port</TableCell>
                                        <TableCell>Protocol</TableCell>
                                    </TableHeader>
                                    <tbody>
                                        {service.ports.map((sp) => (
                                            <TableRow key={sp.name}>
                                                <TableCell>{sp.name}</TableCell>
                                                <TableCell>{sp.nodePort}</TableCell>
                                                <TableCell>{sp.targetPort}</TableCell>
                                                <TableCell>{sp.protocol}</TableCell>
                                            </TableRow>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card>
                        </div>
                    </Card>
                </Accordion>
            ))}
        </div>
    );
}

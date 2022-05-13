/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Alignment, Button, Card, Collapse } from '@blueprintjs/core';
import { Endpoint } from '../../models/service.model';
import TableRow from '../../components/TableRow';
import TableCell from '../../components/TableCell';
import Table from '../../components/Table';
import TableHeader from '../../components/TableHeader';
import TitledCard from '../../components/Cards/TitledCard';

function EndpointTableRow(props: { endpoint: Endpoint }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const icon = isOpen ? 'arrow-up' : 'arrow-down';
    return (
        <>
            <TableRow>
                <TableCell>{props.endpoint.nodeName}</TableCell>
                <TableCell>{props.endpoint.host}</TableCell>
                <TableCell>{props.endpoint.ready.toString()}</TableCell>
                <TableCell alignment={Alignment.RIGHT}>
                    <Button
                        minimal
                        icon={icon}
                        onClick={() => {
                            setIsOpen(!isOpen);
                        }}
                    />
                </TableCell>
            </TableRow>
            <TableRow />
            <TableRow>
                <TableCell style={{ paddingTop: '0', paddingBottom: '0' }} colspan={100}>
                    <Collapse isOpen={isOpen}>
                        <TitledCard title="Ports" style={{ marginBottom: '0.5em' }}>
                            <Card style={{ padding: 0, marginTop: '1em' }}>
                                <div>
                                    <Table className="nested-table">
                                        <TableHeader>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Port</TableCell>
                                            <TableCell>Protocol</TableCell>
                                        </TableHeader>
                                        {/* <TableHeader rowStyle={{backgroundColor: Colors.WHITE}}>
                                            <TableCell style={{borderRadius: "3px 0px 0px 0px", backgroundColor: Colors.WHITE, boxShadow: "inset 0 1px 0 -1px rgb(17 20 24 / 15%)", WebkitBoxShadow: "inset 0 1px 0 -1px rgb(17 20 24 / 15%)"}}>Name</TableCell>
                                            <TableCell style={{backgroundColor: Colors.WHITE, boxShadow: "inset 0 1px 0 -1px rgb(17 20 24 / 15%)", WebkitBoxShadow: "inset 0 1px 0 -1px rgb(17 20 24 / 15%)"}}>Port</TableCell>
                                            <TableCell style={{borderRadius: "0px 3px 0px 0px", backgroundColor: Colors.WHITE, boxShadow: "inset 0 1px 0 -1px rgb(17 20 24 / 15%)", WebkitBoxShadow: "inset 0 1px 0 -1px rgb(17 20 24 / 15%)"}}>Protocol</TableCell>
                                        </TableHeader> */}
                                        <tbody>
                                            {props.endpoint.ports.map((p) => (
                                                <TableRow>
                                                    <TableCell>{p.name}</TableCell>
                                                    <TableCell>{p.port}</TableCell>
                                                    <TableCell>{p.protocol}</TableCell>
                                                </TableRow>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            </Card>
                        </TitledCard>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function EndpointTable(props: { endpoints: Endpoint[] }) {
    return (
        <Card>
            <div style={{ display: 'flex' }}>
                <h3 style={{ margin: 0 }}>Endpoints</h3>
                <div style={{ flexGrow: 1 }} />
            </div>
            <Card style={{ padding: 0, marginTop: '1em' }}>
                <Table>
                    <TableHeader>
                        <TableCell>Node Name</TableCell>
                        <TableCell>Host</TableCell>
                        <TableCell>Ready</TableCell>
                        <TableCell alignment={Alignment.RIGHT} />
                    </TableHeader>
                    <tbody>
                        {props.endpoints.map((e, idx) => (
                            <EndpointTableRow key={idx} endpoint={e} />
                        ))}
                    </tbody>
                </Table>
            </Card>
        </Card>
    );
}

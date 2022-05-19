import * as React from 'react';
import { Card } from '@blueprintjs/core';
import K8 from '../services/k8.service';
import Table from './Table';
import TableHeader from './TableHeader';
import TableCell from './TableCell';
import TableRow from './TableRow';
import { createdAtToHumanReadable } from '../utils/time';
import TableBody from './TableBody';
import { NavContext } from '../layouts/Navigation';
import { Event } from '../models/events.model';

interface IEventTableState {
    events: Event[];
    ws: WebSocket;
    page: number;
}

interface IEventTableProps {
    name: string;
    namespace: string;
    kind: string;
}

class EventTable extends React.Component<IEventTableProps, IEventTableState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: IEventTableProps) {
        super(props);
        this.state = { events: [], ws: null, page: 0 };
    }

    componentDidMount() {
        const cb = (e: MessageEvent<string>) => {
            this.setState({ events: JSON.parse(e.data) as Event[] });
        };
        switch (this.props.kind.toLowerCase()) {
            case 'pod':
                this.setState({
                    ws: K8.openEventWebsocket(
                        this.props.name,
                        this.props.namespace,
                        'pods',
                        1000,
                        cb
                    ),
                });
                break;
            case 'replicaset':
                this.setState({
                    ws: K8.openEventWebsocket(
                        this.props.name,
                        this.props.namespace,
                        'replicasets',
                        1000,
                        cb
                    ),
                });
                break;
            default:
                // eslint-disable-next-line no-console
                console.error(`resource type "${this.props.kind}" is not supported`);
        }
    }

    componentWillUnmount() {
        if (this.state.ws) {
            this.state.ws.close();
        }
    }

    setPage = (page: number) => {
        this.setState({ page });
    };

    render() {
        return (
            <Card style={{ padding: 0 }}>
                <Table>
                    <TableHeader>
                        <TableCell>Name</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Message</TableCell>
                        <TableCell>Last Seen</TableCell>
                        <TableCell>First Seen</TableCell>
                        <TableCell>Count</TableCell>
                    </TableHeader>
                    <TableBody
                        paginationProps={{
                            page: this.state.page,
                            onPageChange: this.setPage,
                            pageSize: 10,
                            total: this.state.events.length,
                        }}
                    >
                        {this.state.events
                            .slice(this.state.page * 10, (this.state.page + 1) * 10)
                            .map((event) => (
                                <TableRow key={event.uid}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{event.reason}</TableCell>
                                    <TableCell>{event.message}</TableCell>
                                    <TableCell>
                                        {createdAtToHumanReadable(event.lastSeen)} ago
                                    </TableCell>
                                    <TableCell>
                                        {createdAtToHumanReadable(event.firstSeen)} ago
                                    </TableCell>
                                    <TableCell>{event.count}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </Card>
        );
    }
}

export default EventTable;

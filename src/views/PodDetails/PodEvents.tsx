import * as React from 'react';
import { Card } from '@blueprintjs/core';
import K8 from '../../services/k8.service';
import TitledCard from '../../components/Cards/TitledCard';
import Table from '../../components/Table';
import TableHeader from '../../components/TableHeader';
import TableCell from '../../components/TableCell';
import TableRow from '../../components/TableRow';
import { createdAtToHumanReadable } from '../../utils/time';
import TableBody from '../../components/TableBody';
import { NavContext } from '../../layouts/Navigation';
import { Event } from '../../models/events.model';

interface IPodEventsState {
    events: Event[];
    ws: WebSocket;
    page: number;
}

interface IPodEventsProps {
    podName: string;
    namespace: string;
}

class PodEvents extends React.Component<IPodEventsProps, IPodEventsState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: IPodEventsProps) {
        super(props);
        this.state = { events: [], ws: null, page: 0 };
    }

    componentDidMount() {
        const cb = (e: MessageEvent<string>) => {
            this.setState({ events: JSON.parse(e.data) as Event[] });
        };
        const ws = K8.pods.openEventWebsocket(this.props.podName, this.props.namespace, 1000, cb);
        this.setState({ ws });
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
            <TitledCard title="Events">
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
            </TitledCard>
        );
    }
}

export default PodEvents;

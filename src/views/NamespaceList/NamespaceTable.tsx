import { Card } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { TOOLTIP2_INDICATOR } from '@blueprintjs/popover2/lib/esm/classes';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';
import { NamespaceMeta } from '../../models/namespace.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace } from '../../utils/routing';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface INamespaceTableState {
    namespaces: NamespaceMeta[];
    pollId: NodeJS.Timer;
}

class NamespaceTable extends React.Component<unknown, INamespaceTableState> {
    constructor(props: any) {
        super(props);
        this.state = { namespaces: [], pollId: null };
    }

    componentDidMount() {
        K8.namespaces.getNamespaces().then((response) => {
            this.setState({
                namespaces: response.data.items,
                pollId: K8.poll(
                    5000,
                    () => K8.namespaces.getNamespaces(),
                    (rs) => {
                        this.setState({ namespaces: rs.data.items });
                    },
                    ''
                ),
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    render() {
        return (
            <Card style={{ padding: 0, minWidth: '40em' }}>
                <Table>
                    <TableHeader>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Status</TableCell>
                    </TableHeader>
                    <tbody>
                        {this.state.namespaces.map((row) => (
                            <TableRow key={row.uid}>
                                <TableCell>
                                    <Link to={buildLinkToNamespace(row.name)}>{row.name}</Link>
                                </TableCell>
                                <TableCell>
                                    <Tooltip2
                                        className={TOOLTIP2_INDICATOR}
                                        content={createdAtToOrigination(row.createdAt)}
                                    >
                                        {createdAtToHumanReadable(row.createdAt)}
                                    </Tooltip2>
                                </TableCell>
                                <TableCell>{row.status}</TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </Card>
        );
    }
}

export default NamespaceTable;

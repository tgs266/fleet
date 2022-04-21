import { Card } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import SortableTableHeaderCell, { TableSort } from '../../components/SortableTableHeaderCell';
import Table from '../../components/Table';
import TableBody from '../../components/TableBody';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';
import { ServiceMeta } from '../../models/service.model';
import K8 from '../../services/k8.service';
import { buildLinkToService } from '../../utils/routing';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';

interface IServiceTableProps extends IWithRouterProps {
    namespace?: string;
}

interface IServiceTableState {
    services: ServiceMeta[];
    sort: TableSort;
}

class DeploymentTable extends React.Component<IServiceTableProps, IServiceTableState> {
    constructor(props: IServiceTableProps) {
        super(props);
        this.state = { services: [], sort: { sortableId: 'name', ascending: false } };
    }

    componentDidMount() {
        this.pull();
    }

    onSortChange = (sort: TableSort) => {
        this.setState({ sort }, this.pull);
    };

    pull = () => {
        K8.services
            .getServices(this.props.namespace || '_all_', this.state.sort)
            .then((response) => {
                this.setState({ services: response.data.items });
            });
    };

    render() {
        return (
            <Card style={{ padding: 0, minWidth: '40em' }}>
                <Table>
                    <TableHeader>
                        <SortableTableHeaderCell
                            sort={this.state.sort}
                            onSortChange={this.onSortChange}
                            sortableId="name"
                        >
                            Name
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                            sort={this.state.sort}
                            onSortChange={this.onSortChange}
                            sortableId="namespace"
                        >
                            Namespace
                        </SortableTableHeaderCell>
                        <SortableTableHeaderCell
                            sort={this.state.sort}
                            onSortChange={this.onSortChange}
                            sortableId="createdAt"
                        >
                            Age
                        </SortableTableHeaderCell>
                    </TableHeader>
                    <TableBody>
                        {this.state.services.map((row) => (
                            <TableRow key={row.name}>
                                <TableCell>
                                    <Link to={buildLinkToService(row.namespace, row.name)}>
                                        {row.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{row.namespace}</TableCell>
                                <TableCell>
                                    <Tooltip2
                                        className={Classes.TOOLTIP2_INDICATOR}
                                        content={createdAtToOrigination(row.createdAt)}
                                    >
                                        {createdAtToHumanReadable(row.createdAt)}
                                    </Tooltip2>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        );
    }
}

export default withRouter(DeploymentTable);

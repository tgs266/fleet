import { Card } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { TOOLTIP2_INDICATOR } from '@blueprintjs/popover2/lib/esm/classes';
import * as React from 'react';
import { Link } from 'react-router-dom';
import SortableTableHeaderCell, { TableSort } from '../../components/SortableTableHeaderCell';
import Table from '../../components/Table';
import TableBody from '../../components/TableBody';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';
import { DeploymentMeta } from '../../models/deployment.model';
import K8 from '../../services/k8.service';
import { buildLinkToDeployment } from '../../utils/routing';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';

interface IDeploymentTableProps extends IWithRouterProps {
    namespace?: string;
}

interface IDeploymentTableState {
    deployments: DeploymentMeta[];
    sort: TableSort;
}

class DeploymentTable extends React.Component<IDeploymentTableProps, IDeploymentTableState> {
    constructor(props: IWithRouterProps) {
        super(props);
        this.state = { deployments: [], sort: { sortableId: 'name', ascending: false } };
    }

    componentDidMount() {
        this.pull();
    }

    onSortChange = (sort: TableSort) => {
        this.setState({ sort }, this.pull);
    };

    pull = () => {
        K8.deployments
            .getDeployments(this.props.namespace || '_all_', this.state.sort)
            .then((response) => {
                this.setState({ deployments: response.data.items });
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
                        <TableCell>Replicas</TableCell>
                    </TableHeader>
                    <TableBody>
                        {this.state.deployments.map((deployment) => (
                            <TableRow key={deployment.name}>
                                <TableCell>
                                    <Link
                                        to={buildLinkToDeployment(
                                            deployment.name,
                                            deployment.namespace
                                        )}
                                    >
                                        {deployment.name}
                                    </Link>
                                </TableCell>
                                <TableCell>{deployment.namespace}</TableCell>
                                <TableCell>
                                    <Tooltip2
                                        className={TOOLTIP2_INDICATOR}
                                        content={createdAtToOrigination(deployment.createdAt)}
                                    >
                                        {createdAtToHumanReadable(deployment.createdAt)}
                                    </Tooltip2>
                                </TableCell>
                                <TableCell>{`${deployment.readyReplicas}/${deployment.replicas}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        );
    }
}

export default withRouter(DeploymentTable);

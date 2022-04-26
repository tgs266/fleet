/* eslint-disable react/no-unstable-nested-components */
import { Alignment, Card, Colors, Icon } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTable from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { Pagination } from '../../models/component.model';
import { DeploymentMeta } from '../../models/deployment.model';
import K8 from '../../services/k8.service';
import { buildLinkToDeployment, buildLinkToNamespace } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';

interface IDeploymentTableProps extends IWithRouterProps {
    namespace?: string;
}

interface IDeploymentTableState extends Pagination {
    deployments: DeploymentMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

class DeploymentTable extends React.Component<IDeploymentTableProps, IDeploymentTableState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            deployments: [],
            sort: {
                sortableId: 'name',
                ascending: false,
            },
            page: 0,
            pageSize: 10,
            total: null,
            pollId: null,
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'deployments',
                    link: '/deployments',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        K8.deployments
            .getDeployments(this.props.namespace, this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    deployments: response.data.items,
                    total: response.data.total,
                    pollId: K8.pollFunction(5000, () => this.pull(null, null)),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    pull = (sort?: TableSort, page?: number) => {
        const usingSort = sort || this.state.sort;
        const usingPage = page !== null ? page : this.state.page;
        K8.deployments
            .getDeployments(
                this.props.namespace,
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    deployments: response.data.items,
                    sort: usingSort,
                    page: usingPage,
                    total: response.data.total,
                });
            });
    };

    sortChange = (sort: TableSort) => {
        this.pull(sort, null);
    };

    setPage = (page: number) => {
        this.pull(null, page);
    };

    render() {
        return (
            <Card style={{ padding: 0, minWidth: '40em' }}>
                <ResourceTable<DeploymentMeta>
                    paginationProps={{
                        page: this.state.page,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onPageChange: this.setPage,
                    }}
                    onSortChange={this.sortChange}
                    sort={this.state.sort}
                    data={this.state.deployments}
                    keyPath="uid"
                    columns={[
                        {
                            key: 'icon',
                            alignment: Alignment.CENTER,
                            columnName: '',
                            columnFunction: (row: DeploymentMeta) => {
                                let color;
                                switch (row.readyReplicas) {
                                    case 0:
                                        color = Colors.RED4;
                                        break;
                                    case row.replicas:
                                        color = Colors.GREEN4;
                                        break;
                                    default:
                                        color = Colors.GOLD5;
                                        break;
                                }
                                const statusHtml = (
                                    <Icon color={color} icon="full-circle" size={14} />
                                );
                                return (
                                    <Tooltip2
                                        content={`${row.readyReplicas}/${row.replicas} pods running`}
                                    >
                                        {statusHtml}
                                    </Tooltip2>
                                );
                            },
                        },
                        {
                            key: 'name',
                            sortableId: 'name',
                            columnName: 'Name',
                            columnFunction: (row: DeploymentMeta) => (
                                <Link to={buildLinkToDeployment(row.name, row.namespace)}>
                                    {row.name}
                                </Link>
                            ),
                        },
                        {
                            key: 'namespace',
                            sortableId: 'namespace',
                            columnName: 'Namespace',
                            columnFunction: (row: DeploymentMeta) => (
                                <Link to={buildLinkToNamespace(row.namespace)}>
                                    {row.namespace}
                                </Link>
                            ),
                        },
                        {
                            key: 'age',
                            columnName: 'Age',
                            sortableId: 'created_at',
                            columnFunction: (row: DeploymentMeta) => (
                                <Tooltip2
                                    className={Classes.TOOLTIP2_INDICATOR}
                                    content={createdAtToOrigination(row.createdAt)}
                                >
                                    {createdAtToHumanReadable(row.createdAt)}
                                </Tooltip2>
                            ),
                        },
                    ]}
                />
                {/* <Table>
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
                                        className={Classes.TOOLTIP2_INDICATOR}
                                        content={createdAtToOrigination(deployment.createdAt)}
                                    >
                                        {createdAtToHumanReadable(deployment.createdAt)}
                                    </Tooltip2>
                                </TableCell>
                                <TableCell>{`${deployment.readyReplicas}/${deployment.replicas}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table> */}
            </Card>
        );
    }
}

export default withRouter(DeploymentTable);

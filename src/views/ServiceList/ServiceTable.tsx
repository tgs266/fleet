/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTable from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { Pagination } from '../../models/component.model';
import { ServiceMeta } from '../../models/service.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToService } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';

interface IServiceTableProps extends IWithRouterProps {
    namespace?: string;
}

interface IServiceTableState extends Pagination {
    services: ServiceMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

class ServiceTable extends React.Component<IServiceTableProps, IServiceTableState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: IServiceTableProps) {
        super(props);
        this.state = {
            services: [],
            sort: {
                sortableId: 'name',
                ascending: true,
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
                    text: 'services',
                    link: '/services',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        K8.services
            .getServices(this.props.namespace, this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    services: response.data.items,
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
        K8.services
            .getServices(
                this.props.namespace,
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    services: response.data.items,
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
                <ResourceTable<ServiceMeta>
                    paginationProps={{
                        page: this.state.page,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onPageChange: this.setPage,
                    }}
                    onSortChange={this.sortChange}
                    sort={this.state.sort}
                    data={this.state.services}
                    keyPath="uid"
                    columns={[
                        {
                            key: 'name',
                            sortableId: 'name',
                            columnName: 'Name',
                            columnFunction: (row: ServiceMeta) => (
                                <Link to={buildLinkToService(row.namespace, row.name)}>
                                    {row.name}
                                </Link>
                            ),
                        },
                        {
                            key: 'namespace',
                            sortableId: 'namespace',
                            columnName: 'Namespace',
                            columnFunction: (row: ServiceMeta) => (
                                <Link to={buildLinkToNamespace(row.namespace)}>
                                    {row.namespace}
                                </Link>
                            ),
                        },
                        {
                            key: 'age',
                            sortableId: 'created_at',
                            columnName: 'Age',
                            columnFunction: (row: ServiceMeta) => (
                                <Tooltip2
                                    className={Classes.TOOLTIP2_INDICATOR}
                                    content={createdAtToOrigination(row.createdAt)}
                                >
                                    {createdAtToHumanReadable(row.createdAt)}
                                </Tooltip2>
                            ),
                        },
                        {
                            key: 'type',
                            columnName: 'Type',
                            columnFunction: (row: ServiceMeta) => row.type,
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
                </Table> */}
            </Card>
        );
    }
}

export default withRouter(ServiceTable);

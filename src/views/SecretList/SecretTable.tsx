/* eslint-disable react/no-unstable-nested-components */
import { Card } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ResourceTable, {
    DEFAULT_SORTABLE_ASCENDING,
    DEFAULT_SORTABLE_ID,
    DEFAULT_SORTABLE_PAGE_SIZE,
} from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { Pagination } from '../../models/component.model';
import { SecretMeta } from '../../models/secret.model';
import K8 from '../../services/k8.service';
import { buildLinkToNamespace, buildLinkToSecret } from '../../utils/routing';
import getOffset from '../../utils/table';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';

interface ISecretTableProps extends IWithRouterProps {
    namespace?: string;
}

interface ISecretTableState extends Pagination {
    secrets: SecretMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

class SecretTable extends React.Component<ISecretTableProps, ISecretTableState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: ISecretTableProps) {
        super(props);
        this.state = {
            secrets: [],
            sort: {
                sortableId: DEFAULT_SORTABLE_ID,
                ascending: DEFAULT_SORTABLE_ASCENDING,
            },
            page: 0,
            pageSize: DEFAULT_SORTABLE_PAGE_SIZE,
            total: null,
            pollId: null,
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'secrets',
                    link: '/secrets',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        K8.secrets
            .getSecrets(this.props.namespace, this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    secrets: response.data.items,
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
        K8.secrets
            .getSecrets(
                this.props.namespace,
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    secrets: response.data.items,
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
                <ResourceTable<SecretMeta>
                    paginationProps={{
                        page: this.state.page,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onPageChange: this.setPage,
                    }}
                    onSortChange={this.sortChange}
                    sort={this.state.sort}
                    data={this.state.secrets}
                    keyPath="uid"
                    columns={[
                        {
                            key: 'name',
                            sortableId: 'name',
                            columnName: 'Name',
                            columnFunction: (row: SecretMeta) => (
                                <Link to={buildLinkToSecret(row.namespace, row.name)}>
                                    {row.name}
                                </Link>
                            ),
                        },
                        {
                            key: 'namespace',
                            sortableId: 'namespace',
                            columnName: 'Namespace',
                            columnFunction: (row: SecretMeta) => (
                                <Link to={buildLinkToNamespace(row.namespace)}>
                                    {row.namespace}
                                </Link>
                            ),
                        },
                        {
                            key: 'age',
                            sortableId: 'created_at',
                            columnName: 'Age',
                            columnFunction: (row: SecretMeta) => (
                                <Tooltip2
                                    className={Classes.TOOLTIP2_INDICATOR}
                                    content={createdAtToOrigination(row.createdAt)}
                                >
                                    {createdAtToHumanReadable(row.createdAt)}
                                </Tooltip2>
                            ),
                        },
                        {
                            key: 'immutable',
                            columnName: 'Immutable?',
                            columnFunction: (row: SecretMeta) => (row.immutable ? 'Yes' : 'No'),
                        },
                    ]}
                />
            </Card>
        );
    }
}

export default withRouter(SecretTable);

import { Card } from '@blueprintjs/core';
import * as React from 'react';
import PodTable from '../../components/PodTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { Pagination } from '../../models/component.model';
import { PodMeta } from '../../models/pod.model';
import K8 from '../../services/k8.service';

interface IPodListState extends Pagination {
    pods: PodMeta[];
    sort: TableSort;
    pollId: NodeJS.Timer;
}

interface IPodTableProps {
    namespace?: string;
}

class PodListTable extends React.Component<IPodTableProps, IPodListState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: any) {
        super(props);
        this.state = {
            pods: [],
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
                    text: 'pods',
                    link: '/pods',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        K8.pods
            .getPods(this.props.namespace, this.state.sort, 0, this.state.pageSize)
            .then((response) => {
                this.setState({
                    pods: response.data.items,
                    total: response.data.total,
                    pollId: K8.poll(
                        5000,
                        () =>
                            K8.pods.getPods(
                                this.props.namespace,
                                this.state.sort,
                                this.getOffset(),
                                this.state.pageSize
                            ),
                        (resp) => {
                            this.setState({ pods: resp.data.items, total: resp.data.total });
                        },
                        ''
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    getOffset = () => {
        const calculatedOffset = this.state.page * this.state.pageSize;
        if (calculatedOffset > this.state.total) {
            const diff = calculatedOffset - this.state.total;
            return this.state.total - diff;
        }
        return calculatedOffset;
    };

    sortChange = (sort: TableSort) => {
        K8.pods
            .getPods(this.props.namespace, sort, this.getOffset(), this.state.pageSize)
            .then((response) => {
                this.setState({ pods: response.data.items, sort, total: response.data.total });
            });
    };

    setPage = (page: number) => {
        this.setState({ page }, () =>
            K8.pods
                .getPods('', this.state.sort, this.getOffset(), this.state.pageSize)
                .then((response) => {
                    this.setState({ pods: response.data.items, total: response.data.total });
                })
        );
    };

    render() {
        return (
            <Card style={{ padding: 0, minWidth: '40em' }}>
                <PodTable
                    pods={this.state.pods}
                    sort={this.state.sort}
                    onSortChange={this.sortChange}
                    paginationProps={{
                        page: this.state.page,
                        pageSize: this.state.pageSize,
                        total: this.state.total,
                        onPageChange: this.setPage,
                    }}
                />
            </Card>
        );
    }
}

export default PodListTable;

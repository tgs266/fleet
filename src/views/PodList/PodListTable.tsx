import { Card } from '@blueprintjs/core';
import * as React from 'react';
import PodTable from '../../components/PodTable';
import {
    DEFAULT_SORTABLE_ID,
    DEFAULT_SORTABLE_ASCENDING,
    DEFAULT_SORTABLE_PAGE_SIZE,
} from '../../components/ResourceTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { Pagination } from '../../models/component.model';
import { PodMeta } from '../../models/pod.model';
import K8 from '../../services/k8.service';
import getOffset from '../../utils/table';

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
        K8.pods
            .getPods(
                this.props.namespace,
                usingSort,
                getOffset(usingPage, this.state.pageSize, this.state.total),
                this.state.pageSize
            )
            .then((response) => {
                this.setState({
                    pods: response.data.items,
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

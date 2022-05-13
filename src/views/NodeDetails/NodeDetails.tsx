/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { AxiosResponse } from 'axios';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { Node } from '../../models/node.model';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Pagination } from '../../models/component.model';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';
import LabelsTagList from '../../components/LabelsTagList';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import { JSONObjectType } from '../../models/json.model';
import Prometheus from '../../services/prometheus.service';
import InfoCard from '../../components/Cards/InfoCard';
import TabControlBar from '../../components/TabControlBar';
import Details from './Tabs/Details';
import Metrics from './Tabs/Metrics';

interface INodeDetailsState {
    node: Node;
    sort: TableSort;
    pagination: Pagination;
    pollId: NodeJS.Timer;
    metricsPollId: NodeJS.Timer;
    metricsData: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
    selectedTab: string;
}

class NodeDetails extends React.Component<IWithRouterProps, INodeDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            selectedTab: 'Details',
            node: null,
            pollId: null,
            metricsPollId: null,
            metricsData: null,
            sort: { sortableId: 'name', ascending: false },
            pagination: { total: null, page: 0, pageSize: 10 },
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'nodes',
                    link: '/nodes',
                },
                {
                    text: this.props.params.nodeName,
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        Prometheus.pollQueryRange(
            {
                memoryUsage: Prometheus.buildQuery('memoryUsage', {
                    resource: 'node',
                    name: this.props.params.nodeName,
                }),
                cpuUsage: Prometheus.buildQuery('cpuUsage', {
                    resource: 'node',
                    name: this.props.params.nodeName,
                }),
                networkTransmitted: Prometheus.buildQuery('networkTransmitted', {
                    resource: 'node',
                    name: this.props.params.nodeName,
                }),
                networkRecieved: Prometheus.buildQuery('networkRecieved', {
                    resource: 'node',
                    name: this.props.params.nodeName,
                }),
            },
            (resp) => {
                this.setState({ metricsData: resp.data });
            },
            (t) => this.setState({ metricsPollId: t })
        );
        K8.nodes
            .getNode(
                this.props.params.nodeName,
                this.state.sort,
                this.getPodOffset(),
                this.state.pagination.pageSize
            )
            .then((response) => {
                this.setState({
                    node: response.data,
                    pagination: { ...this.state.pagination, total: response.data.pods.total },
                    pollId: K8.poll(
                        1000,
                        (...args: any[]) =>
                            K8.nodes.getNode(
                                args[0],
                                this.state.sort,
                                this.getPodOffset(),
                                this.state.pagination.pageSize
                            ),
                        this.setFromResponse,
                        this.props.params.nodeName
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
        clearInterval(this.state.metricsPollId);
    }

    getPodOffset = () => {
        const calculatedOffset = this.state.pagination.page * this.state.pagination.pageSize;
        if (calculatedOffset > this.state.pagination.total) {
            const diff = calculatedOffset - this.state.pagination.total;
            return this.state.pagination.total - diff;
        }
        return calculatedOffset;
    };

    setFromResponse = (r: AxiosResponse<Node>) => {
        this.setState({
            node: r.data,
            pagination: { ...this.state.pagination, total: r.data.pods.total },
        });
    };

    pull = () => {
        K8.nodes
            .getNode(
                this.props.params.nodeName,
                this.state.sort,
                this.getPodOffset(),
                this.state.pagination.pageSize
            )
            .then(this.setFromResponse);
    };

    setSort = (sort: TableSort) => {
        this.setState({ sort }, this.pull);
    };

    setPage = (page: number) => {
        this.setState({ ...this.state, pagination: { ...this.state.pagination, page } }, this.pull);
    };

    setSelectedTab = (tab: string) => {
        this.setState({ selectedTab: tab });
    };

    render() {
        if (!this.state.node) {
            return null;
        }
        const { node } = this.state;
        return (
            <div>
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard object={node} title={node.name}>
                            <div style={{ display: 'flex' }}>
                                <LabeledText label="AGE">
                                    <AgeText value={node.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={node.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {node.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabelsTagList obj={node} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <AnnotationsTagList obj={node} />
                            </div>
                        </InfoCard>
                    </div>

                    <TabControlBar
                        tabs={['Details', 'Metrics']}
                        selectedTab={this.state.selectedTab}
                        setSelectedTab={this.setSelectedTab}
                        style={{ marginBottom: '1em' }}
                    />

                    {this.state.selectedTab === 'Details' && (
                        <Details
                            node={this.state.node}
                            sort={this.state.sort}
                            pagination={this.state.pagination}
                            setSort={this.setSort}
                            setPage={this.setPage}
                        />
                    )}

                    {this.state.selectedTab === 'Metrics' && (
                        <Metrics metricsData={this.state.metricsData} />
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(NodeDetails);

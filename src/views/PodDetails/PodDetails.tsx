/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { Pod } from '../../models/pod.model';
import { getStatusColor } from '../../utils/pods';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/Cards/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { buildLinkToNode } from '../../utils/routing';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import LabelsTagList from '../../components/LabelsTagList';
import EditableResource from '../../components/EditableResource';
import TabControlBar from '../../components/TabControlBar';
import Details from './Tabs/Details';
import Prometheus from '../../services/prometheus.service';
import { JSONObjectType } from '../../models/json.model';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';
import Metrics from './Tabs/Metrics';

interface IPodDetailsState {
    pod: Pod;
    pollId: NodeJS.Timer;
    metricsPollId: NodeJS.Timer;
    selectedTab: string;
    metricsData: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
}

class PodDetails extends React.Component<IWithRouterProps, IPodDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            pod: null,
            pollId: null,
            metricsData: null,
            metricsPollId: null,
            selectedTab: 'Details',
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
                {
                    text: this.props.params.podName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
            ],
        });
        Prometheus.pollQueryRange(
            {
                memoryUsage: Prometheus.buildQuery('memoryUsage', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                memoryLimits: Prometheus.buildQuery('memoryLimits', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                memoryRequests: Prometheus.buildQuery('memoryRequests', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                cpuUsage: Prometheus.buildQuery('cpuUsage', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                cpuLimits: Prometheus.buildQuery('cpuLimits', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                cpuRequests: Prometheus.buildQuery('cpuRequests', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                networkTransmitted: Prometheus.buildQuery('networkTransmitted', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
                networkRecieved: Prometheus.buildQuery('networkRecieved', {
                    resource: 'pod',
                    name: this.props.params.podName,
                    namespace: this.props.params.namespace,
                }),
            },
            (resp) => {
                this.setState({ metricsData: resp.data });
            },
            (t) => this.setState({ metricsPollId: t })
        );
        K8.pods.getPod(this.props.params.podName, this.props.params.namespace).then((response) => {
            this.setState({
                pod: response.data,
                pollId: K8.poll(
                    1000,
                    K8.pods.getPod,
                    (r) => {
                        this.setState({ pod: r.data });
                    },
                    this.props.params.podName,
                    this.props.params.namespace
                ),
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
        clearInterval(this.state.metricsPollId);
    }

    pull = () => {
        K8.pods.getPod(this.props.params.podName, this.props.params.namespace).then((response) => {
            this.setState({ pod: response.data });
        });
    };

    setSelectedTab = (selectedTab: string) => {
        this.setState({ selectedTab });
    };

    render() {
        if (!this.state.pod) {
            return null;
        }
        const { pod } = this.state;
        const statusColor = getStatusColor(pod);
        return (
            <div>
                <EditableResource
                    delete
                    type="pods"
                    name={this.props.params.podName}
                    namespace={this.props.params.namespace}
                />
                {/* show resource usage ici */}
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard
                            title={pod.name}
                            statuColor={statusColor}
                            statusHover={pod.status.reason}
                        >
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">{pod.namespace}</LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="NODE NAME">
                                    <Link to={buildLinkToNode(pod.nodeName)}>{pod.nodeName}</Link>
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="POD IP">
                                    {pod.ip}
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={pod.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={pod.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {pod.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabelsTagList obj={pod} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <AnnotationsTagList obj={pod} />
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
                        <Details metricsData={this.state.metricsData} pod={pod} />
                    )}

                    {this.state.selectedTab === 'Metrics' && (
                        <Metrics metricsData={this.state.metricsData} />
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(PodDetails);

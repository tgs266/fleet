/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { Pod } from '../../models/pod.model';
import { getStatusColor } from '../../utils/pods';
import PodContainerTable from '../../components/PodContainerTable';
import TitledCard from '../../components/TitledCard';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import PodEvents from './PodEvents';
import PodResourceInformation from './PodResourceInformation';
import ConditionTable from '../../components/ConditionTable';
import { buildLinkToNode } from '../../utils/routing';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import LabelsTagList from '../../components/LabelsTagList';
import EditableResource from '../../components/EditableResource';

interface IPodDetailsState {
    pod: Pod;
    pollId: NodeJS.Timer;
}

class PodDetails extends React.Component<IWithRouterProps, IPodDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            pod: null,
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
                {
                    text: this.props.params.podName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
            ],
        });
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
    }

    pull = () => {
        K8.pods.getPod(this.props.params.podName, this.props.params.namespace).then((response) => {
            this.setState({ pod: response.data });
        });
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

                    <div style={{ marginBottom: '1em' }}>
                        <PodResourceInformation podResources={pod.resources} />
                    </div>

                    <div style={{ marginBottom: '1em' }}>
                        <ConditionTable conditions={pod.conditions} />
                    </div>

                    <div style={{ marginBottom: '1em' }}>
                        <TitledCard title="Containers">
                            <PodContainerTable pod={pod} />
                        </TitledCard>
                    </div>

                    <div style={{ marginBottom: '1em' }}>
                        <PodEvents podName={pod.name} namespace={pod.namespace} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(PodDetails);

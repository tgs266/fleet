/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import { Service } from '../../models/service.model';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import Label from '../../components/Label';
import Text from '../../components/Text/Text';
import PodContainer from '../../components/PodContainer';
import TitledCard from '../../components/TitledCard';
import EndpointTable from './EndpointTable';
import TagList from '../../components/TagList';

interface IPodDetailsState {
    service: Service;
    pollId: NodeJS.Timer;
}

class ServiceDetails extends React.Component<IWithRouterProps, IPodDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = { service: null, pollId: null };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'services',
                    link: '/services',
                },
                {
                    text: this.props.params.serviceName,
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        K8.services
            .getService(this.props.params.serviceName, this.props.params.namespace)
            .then((response) => {
                this.setState({ service: response.data });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    render() {
        if (!this.state.service) {
            return null;
        }
        const { service } = this.state;
        return (
            <div>
                {/* show resource usage ici */}
                <div style={{ margin: '1em', marginBottom: '1em' }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard title={service.name}>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">{service.namespace}</LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={service.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={service.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {service.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                {service.labels && (
                                    <Label label="LABELS">
                                        {service.labels && (
                                            <TagList>
                                                {Object.keys(service.labels).map((key) => (
                                                    <Tag
                                                        style={{ marginRight: '0.25em' }}
                                                        intent={Intent.NONE}
                                                        round
                                                    >
                                                        <Text small>
                                                            {key}: {service.labels[key]}
                                                        </Text>
                                                    </Tag>
                                                ))}
                                            </TagList>
                                        )}
                                    </Label>
                                )}
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                {service.annotations && (
                                    <Label label="ANNOTATIONS">
                                        {service.annotations && (
                                            <TagList>
                                                {Object.keys(service.annotations).map((key) => (
                                                    <Tag
                                                        style={{ marginRight: '0.25em' }}
                                                        intent={Intent.NONE}
                                                        round
                                                    >
                                                        <Text small>
                                                            {key}: {service.annotations[key]}
                                                        </Text>
                                                    </Tag>
                                                ))}
                                            </TagList>
                                        )}
                                    </Label>
                                )}
                            </div>
                        </InfoCard>
                    </div>

                    <TitledCard title="Properties" style={{ marginBottom: '1em' }}>
                        <div style={{ marginTop: '0.25em', display: 'flex' }}>
                            <LabeledText label="TYPE">{service.type}</LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="CLUSTER IP">
                                {service.clusterIp}
                            </LabeledText>
                            {service.selector && (
                                <Label label="SELECTOR" style={{ marginLeft: '2em' }}>
                                    {service.selector && (
                                        <TagList>
                                            {Object.keys(service.selector).map((key) => (
                                                <Tag
                                                    style={{ marginRight: '0.25em' }}
                                                    intent={Intent.NONE}
                                                    round
                                                >
                                                    <Text small>
                                                        {key}: {service.selector[key]}
                                                    </Text>
                                                </Tag>
                                            ))}
                                        </TagList>
                                    )}
                                </Label>
                            )}
                        </div>
                    </TitledCard>

                    <PodContainer
                        style={{ marginBottom: '1em' }}
                        pods={service.pods}
                        replicas={service.pods.length}
                    />

                    <EndpointTable endpoints={service.endpoints} />

                    {/* <div style={{marginBottom: "1em"}}>
                        <TitledCard title="Containers">
                            <PodContainerTable pod={pod} />
                        </TitledCard>
                    </div>

                    <ContainerSpecContainer containerSpecs={pod.containers as ContainerSpec[]} /> */}
                </div>
            </div>
        );
    }
}

export default withRouter(ServiceDetails);

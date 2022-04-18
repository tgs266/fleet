/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button, Intent, Menu, MenuItem, Tag } from '@blueprintjs/core';
import { AxiosError } from 'axios';
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
import Label from '../../components/Label';
import Text from '../../components/Text/Text';
import AgeText from '../../components/AgeText';
import TagList from '../../components/TagList';
import PodEvents from './PodEvents';
import TwoButtonDialog from '../../components/Dialogs/TwoButtonDialog';
import Toaster, { showToastWithActionInterval } from '../../services/toast.service';
import PodResourceInformation from './PodResourceInformation';
import ConditionTable from '../../components/ConditionTable';
import { buildLinkToNode } from '../../utils/routing';
import { JSONObject } from '../../models/json.model';
import TextEditDialog from '../../components/Dialogs/EditDialog';
import { FleetError } from '../../models/base';

interface IPodDetailsState {
    pod: Pod;
    pollId: NodeJS.Timer;
    isDialogOpen: boolean;
    isEditDialogOpen: boolean;
    value: JSONObject;
}

class PodDetails extends React.Component<IWithRouterProps, IPodDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            pod: null,
            pollId: null,
            isDialogOpen: false,
            isEditDialogOpen: false,
            value: null,
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
                <Button icon="refresh" onClick={this.pull} />,
                <Button icon="edit" onClick={this.getJson} />,
            ],
            menu: (
                <Menu>
                    <MenuItem icon="trash" text="Delete" onClick={this.toggleDialog} />
                </Menu>
            ),
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

    toggleEditDialog = () => {
        this.setState({ isEditDialogOpen: !this.state.isEditDialogOpen });
    };

    getJson = () => {
        K8.pods
            .getRawPod(this.props.params.podName, this.props.params.namespace)
            .then((response) => {
                this.setState({ value: response.data });
                this.toggleEditDialog();
            });
    };

    pull = () => {
        K8.pods.getPod(this.props.params.podName, this.props.params.namespace).then((response) => {
            this.setState({ pod: response.data });
        });
    };

    toggleDialog = () => {
        this.setState({ isDialogOpen: !this.state.isDialogOpen });
    };

    delete = () => {
        K8.pods
            .deletePod(this.state.pod.name, this.state.pod.namespace)
            .then(() => {
                clearInterval(this.state.pollId);
                this.toggleDialog();
                showToastWithActionInterval(
                    {
                        message: 'Pod Deleted. Redirecting in 5s',
                        intent: Intent.SUCCESS,
                        action: {
                            onClick: () => this.props.navigate(`/pods`),
                            text: 'Go Now',
                        },
                    },
                    5000,
                    () => this.props.navigate(`/pods`)
                );
            })
            .catch(() => {
                this.toggleDialog();
                Toaster.show({
                    message:
                        'Unknown error occured when trying to delete pod. Please refresh and try again',
                    intent: Intent.DANGER,
                });
            });
    };

    onDialogSave = (value: any) => {
        K8.pods
            .updateRawPod(this.state.pod.name, this.state.pod.namespace, value)
            .then(() => {
                this.toggleEditDialog();
                Toaster.show({
                    message: 'Pod successfully updated',
                    intent: Intent.SUCCESS,
                });
            })
            .catch((err: AxiosError<FleetError>) => {
                this.toggleEditDialog();
                Toaster.show({ message: err.response.data.message, intent: Intent.DANGER });
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
                <TwoButtonDialog
                    maxWidth="md"
                    isOpen={this.state.isDialogOpen}
                    onFailure={this.toggleDialog}
                    onSuccess={this.delete}
                    title="Are You Sure?"
                    successText="Yes"
                    failureText="No"
                >
                    <Text large>Are you sure you want to delete this deployment?</Text>
                    <Text large code codePrefix="This action is identical to: ">
                        kubectl delete pod {this.state.pod.name}
                    </Text>
                </TwoButtonDialog>
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
                                {pod.labels && (
                                    <Label label="LABELS">
                                        <TagList>
                                            {Object.keys(pod.labels).map((key) => (
                                                <Tag intent={Intent.NONE} round>
                                                    <Text small>
                                                        {key}: {pod.labels[key]}
                                                    </Text>
                                                </Tag>
                                            ))}
                                        </TagList>
                                    </Label>
                                )}
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                {pod.annotations && (
                                    <Label label="ANNOTATIONS">
                                        <TagList>
                                            {Object.keys(pod.annotations).map((key) => (
                                                <Tag intent={Intent.NONE} round>
                                                    <Text small>
                                                        {key}: {pod.annotations[key]}
                                                    </Text>
                                                </Tag>
                                            ))}
                                        </TagList>
                                    </Label>
                                )}
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
                <TextEditDialog
                    equiv="kubectl apply -f {changes}"
                    initialValue={this.state.value}
                    onSave={this.onDialogSave}
                    onClose={this.toggleEditDialog}
                    isOpen={this.state.isEditDialogOpen}
                />
            </div>
        );
    }
}

export default withRouter(PodDetails);

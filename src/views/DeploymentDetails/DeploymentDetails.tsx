/* eslint-disable react/sort-comp */
import * as React from 'react';
import { Button, Intent, Menu, MenuItem } from '@blueprintjs/core';
import { AxiosError } from 'axios';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import Toaster from '../../services/toast.service';
import { Deployment } from '../../models/deployment.model';
import DeploymentEvents from './DeploymentEvents';
import DeploymentInfoCard from './DeploymentInfoCard';
import ContainerSpecContainer from '../../components/ContainerSpec/ContainerSpecContainer';
import TwoButtonDialog from '../../components/Dialogs/TwoButtonDialog';
import Text from '../../components/Text/Text';
import DeploymentServiceContainer from './DeploymentServiceContainer';
import DeploymentScaleDialog from './DeploymentScaleDialog';
import PodContainer from '../../components/PodContainer';
import ConditionTable from '../../components/ConditionTable';
import TextEditDialog from '../../components/Dialogs/EditDialog';
import { FleetError } from '../../models/base';
import { JSONObject } from '../../models/json.model';

interface IDeploymentDetailsState {
    deployment: Deployment;
    pollId: NodeJS.Timer;
    isDialogOpen: boolean;
    isEditDialogOpen: boolean;
    isScaleDialogOpen: boolean;
    value: JSONObject;
}

class DeploymentDetails extends React.Component<IWithRouterProps, IDeploymentDetailsState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    deployment: string;

    namespace: string;

    constructor(props: IWithRouterProps) {
        super(props);
        this.deployment = this.props.params.deployment;
        this.namespace = this.props.params.namespace;
        this.state = {
            isScaleDialogOpen: false,
            deployment: null,
            pollId: null,
            isDialogOpen: false,
            isEditDialogOpen: false,
            value: null,
        };
    }

    toggleDialog = () => {
        this.setState({ isDialogOpen: !this.state.isDialogOpen });
    };

    toggleScaleDialog = () => {
        this.setState({ isScaleDialogOpen: !this.state.isScaleDialogOpen });
    };

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'deployments',
                    link: '/deployments',
                },
                {
                    text: this.deployment,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.refresh} />,
                <Button key="scale" data-testid="scale" icon="changes" onClick={this.toggleScaleDialog} />,
                <Button key="edit" data-testid="edit" icon="edit" onClick={this.getJson} />,
            ],
            menu: this.getMenu(),
        });
        K8.deployments.getDeployment(this.deployment, this.namespace).then((response) => {
            this.setState({
                deployment: response.data,
                pollId: K8.poll(
                    1000,
                    K8.deployments.getDeployment,
                    (r) => {
                        this.deployment = r.data.name;
                        this.setState({ deployment: r.data });
                    },
                    this.deployment,
                    this.namespace
                ),
            });
        });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    refresh = () => {
        K8.deployments.getDeployment(this.deployment, this.namespace).then((response) => {
            this.setState({ deployment: response.data });
        });
    };

    getMenu = () => {
        const name = this.deployment;

        return (
            <Menu>
                <MenuItem
                    icon="reset"
                    text="Restart"
                    onClick={() => {
                        K8.deployments.restartApp(name, this.namespace).then(() => {
                            Toaster.show({
                                message: `"${name}" is restarting`,
                                intent: Intent.SUCCESS,
                            });
                        });
                    }}
                />
                <MenuItem id="delete-btn" icon="trash" text="Delete" onClick={this.toggleDialog} />
            </Menu>
        );
    };

    delete = () => {
        this.toggleDialog();
        K8.deployments
            .deleteDeployment(this.state.deployment.name, this.state.deployment.namespace)
            .then(() => {
                this.props.navigate('/deployments');
            })
            .catch(() => {
                Toaster.show({ message: 'Failed to delete deployment', intent: Intent.DANGER });
            });
    };

    toggleEditDialog = () => {
        this.setState({ isEditDialogOpen: !this.state.isEditDialogOpen });
    };

    getJson = () => {
        K8.deployments
            .getRawDeployment(this.state.deployment.name, this.state.deployment.namespace)
            .then((r) => {
                this.setState({ value: r.data });
                this.toggleEditDialog();
            });
    };

    onDialogSave = (value: any) => {
        K8.deployments
            .updateRawDeployment(this.state.deployment.name, this.state.deployment.namespace, value)
            .then(() => {
                this.toggleEditDialog();
                Toaster.show({
                    message: 'Deployment successfully updated',
                    intent: Intent.SUCCESS,
                });
            })
            .catch((err: AxiosError<FleetError>) => {
                this.toggleEditDialog();
                Toaster.show({ message: err.response.data.message, intent: Intent.DANGER });
            });
    };

    render() {
        if (!this.state.deployment) {
            return null;
        }
        const { deployment } = this.state;
        return (
            <div>
                <DeploymentScaleDialog
                    isOpen={this.state.isScaleDialogOpen}
                    name={deployment.name}
                    namespace={deployment.namespace}
                    replicas={deployment.replicas}
                    onClose={this.toggleScaleDialog}
                    onSuccess={this.toggleScaleDialog}
                />
                <TwoButtonDialog
                    id="delete-dialog"
                    isOpen={this.state.isDialogOpen}
                    onFailure={this.toggleDialog}
                    onSuccess={this.delete}
                    title="Are You Sure?"
                    successText="Yes"
                    failureText="No"
                >
                    <Text large>Are you sure you want to delete this deployment?</Text>
                    <Text large code codePrefix="This action is identical to: ">
                        kubectl delete deployment {this.state.deployment.name}
                    </Text>
                </TwoButtonDialog>
                <DeploymentInfoCard deployment={deployment} />
                <div style={{ margin: '1em' }}>
                    <ConditionTable conditions={deployment.conditions} ignoreProbe />
                </div>
                <PodContainer
                    style={{ margin: '1em', marginTop: 0 }}
                    pods={deployment.pods}
                    readyReplicas={deployment.readyReplicas}
                    replicas={deployment.replicas}
                />
                <DeploymentServiceContainer
                    style={{ margin: '1em', marginTop: 0 }}
                    services={deployment.services}
                />
                <ContainerSpecContainer
                    refresh={() => {
                        K8.deployments
                            .getDeployment(this.deployment, this.namespace)
                            .then((response) => {
                                this.setState({ deployment: response.data });
                            });
                    }}
                    style={{ margin: '1em', marginTop: 0 }}
                    containerSpecs={deployment.containerSpecs}
                />
                <DeploymentEvents
                    deploymentName={deployment.name}
                    namespace={deployment.namespace}
                />
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

export default withRouter(DeploymentDetails);

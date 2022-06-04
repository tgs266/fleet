/* eslint-disable react/sort-comp */
import * as React from 'react';
import { Button, Intent, MenuItem, Tag } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb } from '../../layouts/Navigation';
import Toaster from '../../services/toast.service';
import { Deployment } from '../../models/deployment.model';
import DeploymentEvents from './DeploymentEvents';
import DeploymentInfoCard from './DeploymentInfoCard';
import ContainerSpecContainer from '../../components/ContainerSpec/ContainerSpecContainer';
import DeploymentServiceContainer from './DeploymentServiceContainer';
import DeploymentScaleDialog from './DeploymentScaleDialog';
import PodContainer from '../../components/PodContainer';
import ConditionTable from '../../components/ConditionTable';
import EditableResource from '../../components/EditableResource';
import { buildLinkToReplicaSet } from '../../utils/routing';
import Text from '../../components/Text/Text';
import ResourceView from '../../components/ResourceView';
import Link from '../../layouts/Link';

interface IDeploymentDetailsState {
    isScaleDialogOpen: boolean;
}

class DeploymentDetails extends ResourceView<
    Deployment,
    IWithRouterProps,
    IDeploymentDetailsState
> {
    // eslint-disable-next-line react/static-property-placement
    deployment: string;

    namespace: string;

    constructor(props: IWithRouterProps) {
        super(props, K8.deployments, 'deployment');
        this.deployment = this.props.params.deployment;
        this.namespace = this.props.params.namespace;
        this.state = {
            ...this.state,
            isScaleDialogOpen: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Deployments',
                    link: '/deployments',
                },
                {
                    text: this.deployment,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
                <Button
                    key="scale"
                    data-testid="scale"
                    icon="changes"
                    onClick={this.toggleScaleDialog}
                />,
            ],
            menu: this.getMenu(),
        });
    }

    toggleScaleDialog = () => {
        this.setState({ isScaleDialogOpen: !this.state.isScaleDialogOpen });
    };

    getMenu = () => {
        const name = this.deployment;

        return [
            <MenuItem
                icon="reset"
                text="Restart"
                onClick={() => {
                    K8.deployments.restartApp({ name, namespace: this.namespace }).then(() => {
                        Toaster.show({
                            message: `"${name}" is restarting`,
                            intent: Intent.SUCCESS,
                        });
                    });
                }}
            />,
        ];
    };

    render() {
        if (!this.state.resource) {
            return null;
        }
        const { resource: deployment } = this.state;
        return (
            <div>
                <EditableResource
                    delete
                    type="deployments"
                    name={this.props.params.deployment}
                    namespace={this.props.params.namespace}
                />
                <DeploymentScaleDialog
                    isOpen={this.state.isScaleDialogOpen}
                    name={deployment.name}
                    namespace={deployment.namespace}
                    replicas={deployment.replicas}
                    onClose={this.toggleScaleDialog}
                    onSuccess={this.toggleScaleDialog}
                />
                <DeploymentInfoCard deployment={deployment} />
                <div style={{ margin: '1em' }}>
                    <ConditionTable conditions={deployment.conditions} ignoreProbe />
                </div>
                <PodContainer
                    rightElement={
                        <div>
                            {deployment.replicaSet && (
                                <Tag round>
                                    <Text small>
                                        Replica Set:{' '}
                                        <Link
                                            style={{ color: 'white' }}
                                            to={buildLinkToReplicaSet(
                                                deployment.replicaSet.namespace,
                                                deployment.replicaSet.name
                                            )}
                                        >
                                            {deployment.replicaSet.name}
                                        </Link>
                                    </Text>
                                </Tag>
                            )}
                        </div>
                    }
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
                    refresh={this.pull}
                    style={{ margin: '1em', marginTop: 0 }}
                    containerSpecs={deployment.containerSpecs}
                />
                <DeploymentEvents
                    deploymentName={deployment.name}
                    namespace={deployment.namespace}
                />
            </div>
        );
    }
}

export default withRouter(DeploymentDetails);

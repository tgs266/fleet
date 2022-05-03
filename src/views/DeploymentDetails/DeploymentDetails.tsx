/* eslint-disable react/sort-comp */
import * as React from 'react';
import { Button, Intent, MenuItem } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import Toaster from '../../services/toast.service';
import { Deployment } from '../../models/deployment.model';
import DeploymentInfoCard from './DeploymentInfoCard';
import DeploymentScaleDialog from './DeploymentScaleDialog';
import EditableResource from '../../components/EditableResource';
import Details from './Tabs/Details';
import Git from './Tabs/Git';

interface IDeploymentDetailsState {
    deployment: Deployment;
    pollId: NodeJS.Timer;
    isScaleDialogOpen: boolean;
    tab: string;
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
            tab: 'dt',
        };
    }

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
            gitButton: true,
            buttons: [
                <Button
                    key="refresh"
                    data-testid="refresh"
                    icon="refresh"
                    onClick={this.refresh}
                />,
                <Button
                    key="scale"
                    data-testid="scale"
                    icon="changes"
                    onClick={this.toggleScaleDialog}
                />,
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

        return [
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
            />,
        ];
    };

    setTab = (tab: string) => {
        this.setState({ tab });
    };

    render() {
        if (!this.state.deployment) {
            return null;
        }
        const { deployment } = this.state;
        return (
            <div>
                <EditableResource
                    delete
                    type="deployments"
                    name={this.props.params.deploymentName}
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
                <DeploymentInfoCard
                    deployment={deployment}
                    selectedTab={this.state.tab}
                    onTabChange={this.setTab}
                />
                {this.state.tab === 'dt' && (
                    <Details deployment={deployment} refresh={this.refresh} />
                )}
                {this.state.tab === 'gt' && <Git />}
            </div>
        );
    }
}

export default withRouter(DeploymentDetails);

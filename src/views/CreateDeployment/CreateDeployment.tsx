/* eslint-disable no-restricted-syntax */
import { Button, Intent } from '@blueprintjs/core';
import _ from 'lodash';
import * as React from 'react';
import axios, { AxiosError } from 'axios';
import { CreateDeployment as CD } from '../../models/deployment.model';
import {} from '../../models/container.model';
import Toaster, { showToastWithActionInterval } from '../../services/toast.service';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import BasicDetails from './BasicDetails';
import ContainerTable from './ContainerTable/ContainerTable';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import TitledCard from '../../components/TitledCard';

interface ICreateDeploymentState {
    deployment: CD;
}

class CreateDeployment extends React.Component<IWithRouterProps, ICreateDeploymentState> {
    // eslint-disable-next-line react/static-property-placement
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            deployment: {
                name: '',
                namespace: 'default',
                replicas: 1,
                containerSpecs: [],
            },
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Create Deployment',
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
    }

    addContainerRow = () => {
        this.setState({
            deployment: {
                ...this.state.deployment,
                containerSpecs: [
                    ...this.state.deployment.containerSpecs,
                    {
                        name: '',
                        image: { name: '', tag: '' },
                        ports: [],
                        envVars: [],
                        cpuRequests: 0,
                        cpuLimit: 0,
                        memRequests: 0,
                        memLimit: 0,
                    },
                ],
            },
        });
    };

    onAppChange = (path: string, value: any) => {
        this.setState({ deployment: _.set(this.state.deployment, path, value) });
    };

    deleteContainerRow = (idx: number) => {
        this.setState({
            deployment: {
                ...this.state.deployment,
                containerSpecs: this.state.deployment.containerSpecs.filter(
                    (a, idx2) => idx !== idx2
                ),
            },
        });
    };

    onContainerSpecChange = (path: string, value: any) => {
        this.setState({
            deployment: {
                ...this.state.deployment,
                containerSpecs: _.set(this.state.deployment.containerSpecs, path, value),
            },
        });
    };

    submit = () => {
        Toaster.clear();
        if (this.state.deployment.name === '') {
            Toaster.show({ message: 'Name must not be empty', intent: Intent.DANGER });
        } else if (this.state.deployment.name.includes(' ')) {
            Toaster.show({ message: 'Name cannot have spaces', intent: Intent.DANGER });
        } else {
            let idx = 1;
            if (this.state.deployment.containerSpecs.length === 0) {
                Toaster.show({
                    message: `Must have at least 1 container spec`,
                    intent: Intent.DANGER,
                });
            }
            for (const spec of this.state.deployment.containerSpecs) {
                if (spec.name === '') {
                    Toaster.show({
                        message: `Container Spec name cannot be empty (Container Spec #${idx})`,
                        intent: Intent.DANGER,
                    });
                } else if (spec.name.includes(' ')) {
                    Toaster.show({
                        message: `Image cannot cannot have spaces (Container Spec #${idx})`,
                        intent: Intent.DANGER,
                    });
                } else if (`${spec.image.name}:${spec.image.tag}` === ':') {
                    Toaster.show({
                        message: `Image cannot be empty (Container Spec #${idx})`,
                        intent: Intent.DANGER,
                    });
                }
                idx += 1;
            }
        }
        K8.deployments
            .createDeployment(this.state.deployment)
            .then(() => {
                showToastWithActionInterval(
                    {
                        message: 'App Created. Redirecting in 5s',
                        intent: Intent.SUCCESS,
                        action: {
                            onClick: () =>
                                this.props.navigate(
                                    `/deployments/${this.state.deployment.namespace}/${this.state.deployment.name}`
                                ),
                            text: 'Go Now',
                        },
                    },
                    5000,
                    () =>
                        this.props.navigate(
                            `/deployments/${this.state.deployment.namespace}/${this.state.deployment.name}`
                        )
                );
            })
            .catch((err: Error | AxiosError) => {
                if (axios.isAxiosError(err)) {
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                    // Access to config, request, and response
                } else {
                    Toaster.show({ message: err.message, intent: Intent.DANGER });
                    // Just a stock error
                }
            });
    };

    render() {
        return (
            <div style={{ margin: '1em', marginBottom: '1em' }}>
                <TitledCard title="Create Deployment" rightElement={<Button data-testid="save-btn" intent={Intent.PRIMARY} text="Save" onClick={this.submit} />}>
                    <BasicDetails app={this.state.deployment} onChange={this.onAppChange} />
                </TitledCard>
                <div style={{ marginBottom: '1em' }}>
                    <ContainerTable
                        containerSpecs={this.state.deployment.containerSpecs}
                        addRow={this.addContainerRow}
                        deleteRow={this.deleteContainerRow}
                        onChange={this.onContainerSpecChange}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(CreateDeployment);

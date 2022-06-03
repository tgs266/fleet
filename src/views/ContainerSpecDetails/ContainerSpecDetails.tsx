/* eslint-disable no-restricted-syntax */
/* eslint-disable react/static-property-placement */
/* eslint-disable react/prefer-stateless-function */
import * as React from 'react';
import _ from 'lodash';
import { AxiosResponse } from 'axios';
import { Button, Intent } from '@blueprintjs/core';
import { ContainerSpec } from '../../models/container.model';
import K8 from '../../services/k8.service';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import ContainerSpecEnvVarEdit from './ContainerSpecEnvVarEdit';
import ContainerSpecResourceEdit from '../../components/ContainerSpec/ContainerSpecResourceEdit';
import ContainerSpecPortEdit from '../../components/ContainerSpec/ContainerSpecPortEdit';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import ContainerSpecDetailsInfoCard from './ContainerSpecTitle';
import Toaster, { showToastWithActionInterval } from '../../services/toast.service';
import TwoButtonDialog from '../../components/Dialogs/TwoButtonDialog';
import Text from '../../components/Text/Text';
import { Deployment } from '../../models/deployment.model';

interface IContainerSpecDetails {
    containerSpec: ContainerSpec;
    oldName: string;
    edited: boolean;
    isDialogOpen: boolean;
}

class ImageDetails extends React.Component<IWithRouterProps, IContainerSpecDetails> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            containerSpec: null,
            oldName: this.props.params.specName,
            edited: false,
            isDialogOpen: false,
        };
    }

    componentDidMount() {
        K8.deployments
            .get({ name: this.props.params.deployment, namespace: this.props.params.namespace })
            .then(this.setFromResponse);
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Deployments',
                    link: '/deployments',
                },
                {
                    text: this.props.params.deployment,
                    link: `/deployments/${this.props.params.namespace}/${this.props.params.deployment}`,
                },
                {
                    text: this.state.oldName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button
                    key="refresh"
                    icon="refresh"
                    data-testid="refresh"
                    onClick={() => {
                        K8.deployments
                            .get({
                                name: this.props.params.deployment,
                                namespace: this.props.params.namespace,
                            })
                            .then(this.setFromResponse);
                    }}
                />,
            ],
        });
    }

    setFromResponse = (response: AxiosResponse<Deployment>) => {
        for (const cs of response.data.containerSpecs) {
            if (cs.name === this.state.oldName) {
                this.setState({ containerSpec: cs });
            }
        }
    };

    onChange = (path: string, value: any) => {
        this.setState({
            containerSpec: _.set(this.state.containerSpec, path, value),
            edited: true,
        });
    };

    onSave = () => {
        const navigate = () =>
            this.props.navigate(
                `/deployments/${this.props.params.namespace}/${this.props.params.deployment}`
            );
        K8.deployments
            .updateContainerSpec(
                { name: this.props.params.deployment, namespace: this.props.params.namespace },
                this.state.oldName,
                this.state.containerSpec
            )
            .then(() => {
                this.setState({ isDialogOpen: false });
                showToastWithActionInterval(
                    {
                        message: 'Container Updated. Redirecting in 5s',
                        intent: Intent.SUCCESS,
                        action: {
                            onClick: navigate,
                            text: 'Go Now',
                        },
                    },
                    5000,
                    navigate
                );
            })
            .catch(() => {
                this.setState({ isDialogOpen: false });
                Toaster.show({ message: 'Container spec update failed', intent: Intent.DANGER });
            });
    };

    render() {
        if (!this.state.containerSpec) {
            return null;
        }
        return (
            <div>
                <TwoButtonDialog
                    id="update-dialog"
                    isOpen={this.state.isDialogOpen}
                    successText="Ok"
                    failureText="Cancel"
                    title="Warning"
                    onFailure={() => {
                        this.setState({ isDialogOpen: false });
                    }}
                    onSuccess={this.onSave}
                >
                    <Text
                        large
                    >{`This action will update the container specification in all pods in this deployment (${this.props.params.deployment}). Are you sure you want to continue?`}</Text>
                </TwoButtonDialog>
                <div style={{ margin: '1em' }}>
                    <ContainerSpecDetailsInfoCard
                        container={this.state.containerSpec}
                        rightElement={
                            <Button
                                intent={Intent.PRIMARY}
                                disabled={!this.state.edited}
                                data-testid="spec-edited-btn"
                                onClick={() => {
                                    this.setState({ isDialogOpen: true });
                                }}
                            />
                        }
                    />
                </div>

                <ContainerSpecPortEdit
                    containerSpec={this.state.containerSpec}
                    onChange={this.onChange}
                />
                <ContainerSpecEnvVarEdit
                    containerSpec={this.state.containerSpec}
                    onChange={this.onChange}
                />
                <ContainerSpecResourceEdit
                    containerSpec={this.state.containerSpec}
                    onChange={this.onChange}
                />
            </div>
        );
    }
}

export default withRouter(ImageDetails);

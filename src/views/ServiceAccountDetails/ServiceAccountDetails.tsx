/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Alignment, Button, Card, Intent } from '@blueprintjs/core';
import { AxiosError } from 'axios';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/Cards/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { BindRequest, ServiceAccount } from '../../models/serviceaccount.model';
import { FleetError } from '../../models/base';
import Toaster from '../../services/toast.service';
import Table from '../../components/Table';
import TitledCard from '../../components/Cards/TitledCard';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableBody from '../../components/TableBody';
import TableRow from '../../components/TableRow';
import { createdAtToOrigination } from '../../utils/time';
import {
    buildLinkToClusterRole,
    buildLinkToClusterRoleBinding,
    buildLinkToRole,
    buildLinkToRoleBinding,
} from '../../utils/routing';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import LabelsTagList from '../../components/LabelsTagList';
import RoleBindDialog from './RoleBindDialog';
import ClusterRoleBindDialog from './ClusterRoleBindDialog';
import EditableResource from '../../components/EditableResource';
import ResourceView from '../../components/ResourceView';
import Link from '../../layouts/Link';

interface IServiceAccountDetailsState {
    isRoleBindOpen: boolean;
    isClusterRoleBindOpen: boolean;
}

class ServiceAccountDetails extends ResourceView<
    ServiceAccount,
    IWithRouterProps,
    IServiceAccountDetailsState
> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props, K8.serviceAccounts, 'serviceAccountName');
        this.state = {
            ...this.state,
            isRoleBindOpen: false,
            isClusterRoleBindOpen: false,
        };
    }

    componentDidMount() {
        super.componentDidMount();
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Service Accounts',
                    link: '/serviceaccounts',
                },
                {
                    text: this.props.params.serviceAccountName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
            ],
            menu: null,
        });
    }

    toggleRoleBindDialog = () => {
        this.setState({ isRoleBindOpen: !this.state.isRoleBindOpen });
    };

    toggleClusterRoleBindDialog = () => {
        this.setState({ isClusterRoleBindOpen: !this.state.isClusterRoleBindOpen });
    };

    closeBothBindDialogs = () => {
        this.setState({ isClusterRoleBindOpen: false, isRoleBindOpen: false });
    };

    bindTo = (br: BindRequest) => {
        let call = K8.serviceAccounts.bindToRole;
        if (this.state.isClusterRoleBindOpen) {
            call = K8.serviceAccounts.bindToClusterRole;
        }
        call(
            { name: this.props.params.serviceAccountName, namespace: this.props.params.namespace },
            br
        )
            .then(() => {
                this.closeBothBindDialogs();
                Toaster.show({
                    message: 'Successfully added binding',
                    intent: Intent.SUCCESS,
                });
            })
            .catch((err: AxiosError<FleetError>) => {
                this.closeBothBindDialogs();
                Toaster.show({ message: err.response.data.message, intent: Intent.DANGER });
            });
    };

    disconnect = (mode: string, br: BindRequest) => {
        let call = K8.serviceAccounts.disconnectRole;
        if (mode === 'CLUSTER') {
            call = K8.serviceAccounts.disconnectClusterRole;
        }
        call(
            { name: this.props.params.serviceAccountName, namespace: this.props.params.namespace },
            br
        )
            .then(() => {
                Toaster.show({
                    message: 'Successfully removed binding',
                    intent: Intent.SUCCESS,
                });
            })
            .catch((err: AxiosError<FleetError>) => {
                this.closeBothBindDialogs();
                Toaster.show({ message: err.response.data.message, intent: Intent.DANGER });
            });
    };

    render() {
        if (!this.state.resource) {
            return null;
        }
        const { resource: serviceAccount } = this.state;
        return (
            <div>
                <EditableResource
                    delete
                    refresh={this.pull}
                    type="serviceaccounts"
                    namespace={serviceAccount.namespace}
                    name={serviceAccount.name}
                />
                <RoleBindDialog
                    isOpen={this.state.isRoleBindOpen}
                    onFailure={this.toggleRoleBindDialog}
                    onSuccess={this.bindTo}
                />
                <ClusterRoleBindDialog
                    isOpen={this.state.isClusterRoleBindOpen}
                    onFailure={this.toggleClusterRoleBindDialog}
                    onSuccess={this.bindTo}
                />
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard title={serviceAccount.name}>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">
                                    {serviceAccount.namespace}
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={serviceAccount.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={serviceAccount.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {serviceAccount.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabelsTagList obj={serviceAccount} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <AnnotationsTagList obj={serviceAccount} />
                            </div>
                        </InfoCard>

                        <TitledCard
                            style={{ marginTop: '1em' }}
                            title="Role Bindings"
                            rightElement={
                                <Button
                                    data-testid="open-role-binding"
                                    icon="add"
                                    onClick={this.toggleRoleBindDialog}
                                />
                            }
                        >
                            <Card style={{ padding: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableCell>Binding Name</TableCell>
                                        <TableCell>Role Name</TableCell>
                                        <TableCell>Age</TableCell>
                                        <TableCell alignment={Alignment.RIGHT} />
                                    </TableHeader>
                                    <TableBody>
                                        {serviceAccount.roleBindings.map((role) => (
                                            <TableRow key={role.uid}>
                                                <TableCell>
                                                    <Link
                                                        to={buildLinkToRoleBinding(
                                                            role.namespace,
                                                            role.name
                                                        )}
                                                    >
                                                        {role.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        to={buildLinkToRole(
                                                            serviceAccount.namespace,
                                                            role.roleName
                                                        )}
                                                    >
                                                        {role.roleName}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip2
                                                        className={Classes.TOOLTIP2_INDICATOR}
                                                        content={createdAtToOrigination(
                                                            role.createdAt
                                                        )}
                                                    >
                                                        <AgeText hr value={role.createdAt} />
                                                    </Tooltip2>
                                                </TableCell>
                                                <TableCell alignment={Alignment.RIGHT}>
                                                    <Button
                                                        data-testid="remove-role-binding"
                                                        icon="trash"
                                                        onClick={() =>
                                                            this.disconnect('', {
                                                                targetRoleName: role.name,
                                                                targetRoleNamespace: role.namespace,
                                                            })
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TitledCard>

                        <TitledCard
                            style={{ marginTop: '1em' }}
                            title="Cluster Role Bindings"
                            rightElement={
                                <Button
                                    icon="add"
                                    data-testid="open-cluster-role-binding"
                                    onClick={this.toggleClusterRoleBindDialog}
                                />
                            }
                        >
                            <Card style={{ padding: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableCell>Binding Name</TableCell>
                                        <TableCell>Role Name</TableCell>
                                        <TableCell>Age</TableCell>
                                        <TableCell alignment={Alignment.RIGHT} />
                                    </TableHeader>
                                    <TableBody>
                                        {serviceAccount.clusterRoleBindings.map((role) => (
                                            <TableRow key={role.uid}>
                                                <TableCell>
                                                    <Link
                                                        to={buildLinkToClusterRoleBinding(
                                                            role.name
                                                        )}
                                                    >
                                                        {role.name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Link
                                                        to={buildLinkToClusterRole(role.roleName)}
                                                    >
                                                        {role.roleName}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip2
                                                        className={Classes.TOOLTIP2_INDICATOR}
                                                        content={createdAtToOrigination(
                                                            role.createdAt
                                                        )}
                                                    >
                                                        <AgeText hr value={role.createdAt} />
                                                    </Tooltip2>
                                                </TableCell>
                                                <TableCell alignment={Alignment.RIGHT}>
                                                    <Button
                                                        icon="trash"
                                                        onClick={() =>
                                                            this.disconnect('CLUSTER', {
                                                                targetRoleName: role.name,
                                                                targetRoleNamespace: '',
                                                            })
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Card>
                        </TitledCard>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ServiceAccountDetails);

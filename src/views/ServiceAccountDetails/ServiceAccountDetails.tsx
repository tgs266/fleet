/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button, Card, Intent } from '@blueprintjs/core';
import { AxiosError } from 'axios';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import { Link } from 'react-router-dom';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { BindRequest, ServiceAccount } from '../../models/serviceaccount.model';
import { FleetError } from '../../models/base';
import Toaster from '../../services/toast.service';
import Table from '../../components/Table';
import TitledCard from '../../components/TitledCard';
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
import LabeledAnnotationsTagList from '../../components/AnnotationsTagList';
import LabeledLabelsTagList from '../../components/LabelsTagList';
import ServiceAccounts from '../../services/k8/serviceaccount.service';
import RoleBindDialog from './RoleBindDialog';
import ClusterRoleBindDialog from './ClusterRoleBindDialog';

interface IServiceAccountDetailsState {
    serviceAccount: ServiceAccount;
    pollId: NodeJS.Timer;
    isRoleBindOpen: boolean;
    isClusterRoleBindOpen: boolean;
}

class ServiceAccountDetails extends React.Component<IWithRouterProps, IServiceAccountDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            serviceAccount: null,
            pollId: null,
            isRoleBindOpen: false,
            isClusterRoleBindOpen: false,
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'service accounts',
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
        K8.serviceAccounts
            .getServiceAccount(this.props.params.serviceAccountName, this.props.params.namespace)
            .then((response) => {
                this.setState({
                    serviceAccount: response.data,
                    pollId: K8.poll(
                        1000,
                        K8.serviceAccounts.getServiceAccount,
                        (r) => {
                            this.setState({ serviceAccount: r.data });
                        },
                        this.props.params.serviceAccountName,
                        this.props.params.namespace
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
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

    pull = () => {
        K8.serviceAccounts
            .getServiceAccount(this.props.params.serviceAccountName, this.props.params.namespace)
            .then((response) => {
                this.setState({ serviceAccount: response.data });
            });
    };

    bindTo = (br: BindRequest) => {
        let call = ServiceAccounts.bindToRole;
        if (this.state.isClusterRoleBindOpen) {
            call = ServiceAccounts.bindToClusterRole;
        }
        call(this.props.params.serviceAccountName, this.props.params.namespace, br)
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

    render() {
        if (!this.state.serviceAccount) {
            return null;
        }
        const { serviceAccount } = this.state;
        return (
            <div>
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
                                <LabeledLabelsTagList obj={serviceAccount} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledAnnotationsTagList obj={serviceAccount} />
                            </div>
                        </InfoCard>

                        <TitledCard
                            style={{ marginTop: '1em' }}
                            title="Role Bindings"
                            rightElement={<Button icon="add" onClick={this.toggleRoleBindDialog} />}
                        >
                            <Card style={{ padding: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableCell>Binding Name</TableCell>
                                        <TableCell>Role Name</TableCell>
                                        <TableCell>Age</TableCell>
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
                                <Button icon="add" onClick={this.toggleClusterRoleBindDialog} />
                            }
                        >
                            <Card style={{ padding: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableCell>Binding Name</TableCell>
                                        <TableCell>Role Name</TableCell>
                                        <TableCell>Age</TableCell>
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

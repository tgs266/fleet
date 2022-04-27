/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Button, Card } from '@blueprintjs/core';
import { Tooltip2, Classes } from '@blueprintjs/popover2';
import { Link } from 'react-router-dom';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { ServiceAccount } from '../../models/serviceaccount.model';
import Table from '../../components/Table';
import TitledCard from '../../components/TitledCard';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableBody from '../../components/TableBody';
import TableRow from '../../components/TableRow';
import { createdAtToOrigination } from '../../utils/time';
import { buildLinkToRole } from '../../utils/routing';
import LabeledAnnotationsTagList from '../../components/AnnotationsTagList';
import LabeledLabelsTagList from '../../components/LabelsTagList';

interface IServiceAccountDetailsState {
    serviceAccount: ServiceAccount;
    pollId: NodeJS.Timer;
}

class ServiceAccountDetails extends React.Component<IWithRouterProps, IServiceAccountDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            serviceAccount: null,
            pollId: null,
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

    pull = () => {
        K8.serviceAccounts
            .getServiceAccount(this.props.params.serviceAccountName, this.props.params.namespace)
            .then((response) => {
                this.setState({ serviceAccount: response.data });
            });
    };

    render() {
        if (!this.state.serviceAccount) {
            return null;
        }
        const { serviceAccount } = this.state;
        console.log(serviceAccount);
        return (
            <div>
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

                        <TitledCard style={{ marginTop: '1em' }} title="Role Bindings">
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
                                                <TableCell>{role.name}</TableCell>
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
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ServiceAccountDetails);

/* eslint-disable react/no-array-index-key */
/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Alignment, Button, Card, Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import { RoleBinding } from '../../models/role.model';
import LabeledAnnotationsTagList from '../../components/AnnotationsTagList';
import LabeledLabelsTagList from '../../components/LabelsTagList';
import TitledCard from '../../components/TitledCard';
import Table from '../../components/Table';
import TableHeader from '../../components/TableHeader';
import TableCell from '../../components/TableCell';
import TableBody from '../../components/TableBody';
import TableRow from '../../components/TableRow';
import Text from '../../components/Text/Text';

interface IRoleBindingState {
    binding: RoleBinding;
    pollId: NodeJS.Timer;
}

class RoleBindingDetails extends React.Component<IWithRouterProps, IRoleBindingState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            binding: null,
            pollId: null,
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'role bindings',
                    link: '/rolebindings',
                },
                {
                    text: this.props.params.roleBindingName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
            ],
            menu: null,
        });
        K8.roleBindings
            .getRoleBinding(this.props.params.roleBindingName, this.props.params.namespace)
            .then((response) => {
                this.setState({
                    binding: response.data,
                    pollId: K8.poll(
                        1000,
                        K8.roleBindings.getRoleBinding,
                        (r) => {
                            this.setState({ binding: r.data });
                        },
                        this.props.params.roleBindingName,
                        this.props.params.namespace
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    pull = () => {
        K8.roleBindings
            .getRoleBinding(this.props.params.roleBindingName, this.props.params.namespace)
            .then((response) => {
                this.setState({ binding: response.data });
            });
    };

    render() {
        if (!this.state.binding) {
            return null;
        }
        const { binding } = this.state;
        return (
            <div>
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard title={binding.name}>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">{binding.namespace}</LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={binding.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={binding.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {binding.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledLabelsTagList obj={binding} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledAnnotationsTagList obj={binding} />
                            </div>
                        </InfoCard>

                        <TitledCard style={{ marginTop: '1em' }} title="Subjects">
                            <Card style={{ padding: 0 }}>
                                <Table>
                                    <TableHeader>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Namespace</TableCell>
                                        <TableCell>Kind</TableCell>
                                        <TableCell alignment={Alignment.RIGHT}>
                                            <Tooltip2
                                                content={
                                                    <div>
                                                        These subjects may not be actual resources
                                                        in Kubernetes. For example,{' '}
                                                        <Text code>Kind: Group</Text> and{' '}
                                                        <Text code>Kind: User</Text> are properties
                                                        that are returned by authentication systems
                                                        (like OIDC).
                                                    </div>
                                                }
                                            >
                                                <Icon icon="help" />
                                            </Tooltip2>
                                        </TableCell>
                                    </TableHeader>
                                    <TableBody>
                                        {binding.subjects &&
                                            binding.subjects.map((subject, idx) => (
                                                <TableRow key={idx}>
                                                    <TableCell>{subject.name}</TableCell>
                                                    <TableCell>{subject.namespace}</TableCell>
                                                    <TableCell>{subject.kind}</TableCell>
                                                    <TableCell />
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

export default withRouter(RoleBindingDetails);

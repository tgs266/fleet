/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Intent, MenuItem, Tag } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/Cards/InfoCard';
import LabeledText from '../../components/LabeledText';
import AgeText from '../../components/AgeText';
import PodContainer from '../../components/PodContainer';
import EditableResource from '../../components/EditableResource';
import { Owner, ReplicaSet } from '../../models/replicaset.model';
import TagList from '../../components/TagList';
import Text from '../../components/Text/Text';
import { buildLinkToOwner } from '../../utils/routing';
import TitledCard from '../../components/Cards/TitledCard';
import Table from '../../components/Table';
import TableBody from '../../components/TableBody';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';
import EventTable from '../../components/EventTable';
import Toaster from '../../services/toast.service';
import SSE from '../../services/sse.service';

interface IReplicaSetDetailsState {
    replicaSet: ReplicaSet;
    sse: SSE;
}

class ReplicaSetDetails extends React.Component<IWithRouterProps, IReplicaSetDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = { replicaSet: null, sse: null };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'Replica Sets',
                    link: '/replicasets',
                },
                {
                    text: this.props.params.replicaSetName,
                },
            ] as IBreadcrumb[],
            buttons: [
                <Button key="refresh" data-testid="refresh" icon="refresh" onClick={this.pull} />,
            ],
            menu: [
                <MenuItem
                    icon="reset"
                    text="Restart"
                    onClick={() => {
                        K8.replicaSets
                            .restartReplicaSet(
                                this.props.params.replicaSetName,
                                this.props.params.namespace
                            )
                            .then(() => {
                                Toaster.show({
                                    message: `"${this.props.params.replicaSetName}" is restarting`,
                                    intent: Intent.SUCCESS,
                                });
                            });
                    }}
                />,
            ],
        });
        K8.replicaSets
            .getReplicaSet(this.props.params.replicaSetName, this.props.params.namespace)
            .then((response) => {
                this.setState({ replicaSet: response.data });
            });
        this.setState({
            sse: K8.replicaSets
                .sse(this.props.params.replicaSetName, this.props.params.namespace)
                .subscribe<ReplicaSet>((data) => this.setState({ replicaSet: data })),
        });
    }

    componentWillUnmount() {
        this.state.sse.close();
    }

    getLinkToOwner = (owner: Owner) => {
        const linkData = buildLinkToOwner(owner, this.state.replicaSet.namespace);
        if (linkData.valid) {
            return (
                <Link style={{ color: 'white' }} to={linkData.link}>
                    {owner.name}
                </Link>
            );
        }
        return owner.name;
    };

    pull = () => {
        K8.replicaSets
            .getReplicaSet(this.props.params.replicaSetName, this.props.params.namespace)
            .then((response) => {
                this.setState({ replicaSet: response.data });
            });
    };

    render() {
        if (!this.state.replicaSet) {
            return null;
        }
        const { replicaSet } = this.state;
        return (
            <div>
                <EditableResource
                    delete
                    refresh={this.pull}
                    type="replicasets"
                    namespace={replicaSet.namespace}
                    name={replicaSet.name}
                />
                <div style={{ margin: '1em', marginBottom: '1em' }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard object={replicaSet} title={replicaSet.name}>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="NAMESPACE">{replicaSet.namespace}</LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                                    <AgeText value={replicaSet.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={replicaSet.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {replicaSet.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabeledText label="CONTROLLED BY">
                                    <TagList>
                                        {replicaSet.owners.map((owner) => (
                                            <Tag key={owner.name} intent={Intent.NONE} round>
                                                <Text small>
                                                    {owner.kind}: {this.getLinkToOwner(owner)}
                                                </Text>
                                            </Tag>
                                        ))}
                                    </TagList>
                                </LabeledText>
                            </div>
                        </InfoCard>
                    </div>

                    <TitledCard title="Tolerances" style={{ marginBottom: '1em' }}>
                        <Card style={{ padding: 0 }}>
                            <Table>
                                <TableHeader>
                                    <TableCell>Key</TableCell>
                                    <TableCell>Operator</TableCell>
                                    <TableCell>Value</TableCell>
                                    <TableCell>Effect</TableCell>
                                    <TableCell>Seconds</TableCell>
                                </TableHeader>
                                <TableBody>
                                    {replicaSet.tolerances &&
                                        replicaSet.tolerances.map((tolerance) => (
                                            <TableRow key={tolerance.key}>
                                                <TableCell>{tolerance.key}</TableCell>
                                                <TableCell>{tolerance.operator || '-'}</TableCell>
                                                <TableCell>{tolerance.value || '-'}</TableCell>
                                                <TableCell>{tolerance.effect || '-'}</TableCell>
                                                <TableCell>
                                                    {tolerance.tolerationSeconds || '-'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </Card>
                    </TitledCard>

                    <PodContainer
                        style={{ marginBottom: '1em' }}
                        pods={replicaSet.pods}
                        replicas={replicaSet.readyReplicas}
                    />

                    <TitledCard title="Events" style={{ marginBottom: '1em' }}>
                        <EventTable
                            kind="replicaset"
                            name={replicaSet.name}
                            namespace={replicaSet.namespace}
                        />
                    </TitledCard>
                </div>
            </div>
        );
    }
}

export default withRouter(ReplicaSetDetails);

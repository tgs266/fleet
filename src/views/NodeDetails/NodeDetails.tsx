/* eslint-disable react/static-property-placement */
import * as React from 'react';
import { AxiosResponse } from 'axios';
import { Card, Intent, Tag } from '@blueprintjs/core';
import { IWithRouterProps, withRouter } from '../../utils/withRouter';
import K8 from '../../services/k8.service';
import TitledCard from '../../components/TitledCard';
import { IBreadcrumb, NavContext } from '../../layouts/Navigation';
import InfoCard from '../../components/InfoCard';
import LabeledText from '../../components/LabeledText';
import Label from '../../components/Label';
import Text from '../../components/Text/Text';
import AgeText from '../../components/AgeText';
import { Node } from '../../models/node.model';
import TagList from '../../components/TagList';
import NodeResourceInformation from './NodeResourceInformation';
import PodTable from '../../components/PodTable';
import { TableSort } from '../../components/SortableTableHeaderCell';
import { Pagination } from '../../models/component.model';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import LabelsTagList from '../../components/LabelsTagList';

interface INodeDetailsState {
    node: Node;
    sort: TableSort;
    pagination: Pagination;
    pollId: NodeJS.Timer;
}

class NodeDetails extends React.Component<IWithRouterProps, INodeDetailsState> {
    static contextType = NavContext;

    constructor(props: IWithRouterProps) {
        super(props);
        this.state = {
            node: null,
            pollId: null,
            sort: { sortableId: 'name', ascending: false },
            pagination: { total: null, page: 0, pageSize: 10 },
        };
    }

    componentDidMount() {
        const [, setState] = this.context;
        setState({
            breadcrumbs: [
                {
                    text: 'nodes',
                    link: '/nodes',
                },
                {
                    text: this.props.params.nodeName,
                },
            ] as IBreadcrumb[],
            buttons: [],
            menu: null,
        });
        K8.nodes
            .getNode(
                this.props.params.nodeName,
                this.state.sort,
                this.getPodOffset(),
                this.state.pagination.pageSize
            )
            .then((response) => {
                this.setState({
                    node: response.data,
                    pagination: { ...this.state.pagination, total: response.data.pods.total },
                    pollId: K8.poll(
                        1000,
                        (...args: any[]) =>
                            K8.nodes.getNode(
                                args[0],
                                this.state.sort,
                                this.getPodOffset(),
                                this.state.pagination.pageSize
                            ),
                        this.setFromResponse,
                        this.props.params.nodeName
                    ),
                });
            });
    }

    componentWillUnmount() {
        clearInterval(this.state.pollId);
    }

    getPodOffset = () => {
        const calculatedOffset = this.state.pagination.page * this.state.pagination.pageSize;
        if (calculatedOffset > this.state.pagination.total) {
            const diff = calculatedOffset - this.state.pagination.total;
            return this.state.pagination.total - diff;
        }
        return calculatedOffset;
    };

    setFromResponse = (r: AxiosResponse<Node>) => {
        this.setState({
            node: r.data,
            pagination: { ...this.state.pagination, total: r.data.pods.total },
        });
    };

    pull = () => {
        K8.nodes
            .getNode(
                this.props.params.nodeName,
                this.state.sort,
                this.getPodOffset(),
                this.state.pagination.pageSize
            )
            .then(this.setFromResponse);
    };

    setSort = (sort: TableSort) => {
        this.setState({ sort }, this.pull);
    };

    setPage = (page: number) => {
        this.setState({ ...this.state, pagination: { ...this.state.pagination, page } }, this.pull);
    };

    render() {
        if (!this.state.node) {
            return null;
        }
        const { node } = this.state;
        return (
            <div>
                <div style={{ margin: '1em', marginBottom: 0 }}>
                    <div style={{ marginBottom: '1em' }}>
                        <InfoCard title={node.name}>
                            <div style={{ display: 'flex' }}>
                                <LabeledText label="AGE">
                                    <AgeText value={node.createdAt} hr />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                                    <AgeText value={node.createdAt} />
                                </LabeledText>
                                <LabeledText style={{ marginLeft: '2em' }} label="UID">
                                    {node.uid}
                                </LabeledText>
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <LabelsTagList obj={node} />
                            </div>
                            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                                <AnnotationsTagList obj={node} />
                            </div>
                        </InfoCard>
                    </div>

                    <TitledCard style={{ marginBottom: '1em' }} title="Node Info">
                        <div style={{ display: 'flex' }}>
                            <LabeledText label="MACHINE ID">{node.nodeInfo.machineID}</LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="SYSTEM UUID">
                                {node.nodeInfo.systemUUID}
                            </LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="BOOT ID">
                                {node.nodeInfo.bootID}
                            </LabeledText>
                        </div>
                        <div style={{ display: 'flex', marginTop: '0.25em' }}>
                            <LabeledText label="OS IMAGE">{node.nodeInfo.osImage}</LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="OPERATING SYSTEM">
                                {node.nodeInfo.operatingSystem}
                            </LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="KERNEL VERSION">
                                {node.nodeInfo.kernelVersion}
                            </LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="ARCHITECTURE">
                                {node.nodeInfo.architecture}
                            </LabeledText>
                            <LabeledText
                                style={{ marginLeft: '2em' }}
                                label="CONTAINER RUNTIME VERSION"
                            >
                                {node.nodeInfo.containerRuntimeVersion}
                            </LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="KUBELET VERSION">
                                {node.nodeInfo.kubeletVersion}
                            </LabeledText>
                            <LabeledText style={{ marginLeft: '2em' }} label="KUBE-PROXY VERSION">
                                {node.nodeInfo.kubeProxyVersion}
                            </LabeledText>
                        </div>
                    </TitledCard>

                    <TitledCard style={{ marginBottom: '1em' }} title="Network Info">
                        <div style={{ display: 'flex' }}>
                            <LabeledText label="POD CIDR">{node.podCIDR}</LabeledText>
                        </div>
                        <div style={{ display: 'flex', marginTop: '0.25em' }}>
                            {node.addresses && (
                                <Label label="ADDRESSES">
                                    <TagList spacing="0.25em">
                                        {node.addresses.map((addr) => (
                                            <Tag intent={Intent.NONE} round>
                                                <Text small>
                                                    {addr.type}: {addr.address}
                                                </Text>
                                            </Tag>
                                        ))}
                                    </TagList>
                                </Label>
                            )}
                        </div>
                    </TitledCard>

                    <NodeResourceInformation style={{ marginBottom: '1em' }} nodeMeta={node} />

                    <TitledCard style={{ marginBottom: '1em' }} title="Pods">
                        <Card style={{ padding: 0 }}>
                            <PodTable
                                pods={node.pods.items}
                                sort={this.state.sort}
                                onSortChange={this.setSort}
                                paginationProps={{
                                    ...this.state.pagination,
                                    onPageChange: this.setPage,
                                }}
                            />
                        </Card>
                    </TitledCard>
                </div>
            </div>
        );
    }
}

export default withRouter(NodeDetails);

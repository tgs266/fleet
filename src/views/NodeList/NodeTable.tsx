import { Card, Tag } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Table from '../../components/Table';
import TableCell from '../../components/TableCell';
import TableHeader from '../../components/TableHeader';
import TableRow from '../../components/TableRow';
import { NodeMeta } from '../../models/node.model';
import K8 from '../../services/k8.service';
import { BytesTo } from '../../utils/conversions';
import { buildLinkToNode } from '../../utils/routing';
import { createdAtToHumanReadable, createdAtToOrigination } from '../../utils/time';

interface INodeTableState {
    nodes: NodeMeta[];
}

class NodeTable extends React.Component<unknown, INodeTableState> {
    constructor(props: any) {
        super(props);
        this.state = { nodes: [] };
    }

    componentDidMount() {
        K8.nodes.getNodes().then((response) => {
            this.setState({ nodes: response.data });
        });
    }

    render() {
        return (
            <Card style={{ padding: 0, minWidth: '40em' }}>
                <Table>
                    <TableHeader>
                        <TableCell>Name</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>
                            CPU Requests{' '}
                            <Tag minimal round>
                                Cores
                            </Tag>
                        </TableCell>
                        <TableCell>
                            CPU Limit{' '}
                            <Tag minimal round>
                                Cores
                            </Tag>
                        </TableCell>
                        <TableCell>
                            Memory Requests{' '}
                            <Tag minimal round>
                                GB
                            </Tag>
                        </TableCell>
                        <TableCell>
                            Memory Limit{' '}
                            <Tag minimal round>
                                GB
                            </Tag>
                        </TableCell>
                        <TableCell>Pods</TableCell>
                    </TableHeader>
                    <tbody>
                        {this.state.nodes.map((node) => (
                            <TableRow key={node.uid}>
                                <TableCell>
                                    <Link to={buildLinkToNode(node.name)}>{node.name}</Link>
                                </TableCell>
                                <TableCell>
                                    <Tooltip2
                                        className={Classes.TOOLTIP2_INDICATOR}
                                        content={createdAtToOrigination(node.createdAt)}
                                    >
                                        {createdAtToHumanReadable(node.createdAt)}
                                    </Tooltip2>
                                </TableCell>
                                <TableCell>
                                    {node.nodeResources.cpuRequests / 1000} /{' '}
                                    {node.nodeResources.cpuCapacity / 1000}{' '}
                                    <Tag minimal round>
                                        {(node.nodeResources.cpuRequestsFraction * 100).toFixed(2)}%
                                    </Tag>
                                </TableCell>
                                <TableCell>
                                    {node.nodeResources.cpuLimit / 1000} /{' '}
                                    {node.nodeResources.cpuCapacity / 1000}{' '}
                                    <Tag minimal round>
                                        {(node.nodeResources.cpuLimitFraction * 100).toFixed(2)}%
                                    </Tag>
                                </TableCell>
                                <TableCell>
                                    {BytesTo.gigabytes(node.nodeResources.memoryRequests).toFixed(
                                        2
                                    )}{' '}
                                    /{' '}
                                    {BytesTo.gigabytes(node.nodeResources.memoryCapacity).toFixed(
                                        2
                                    )}{' '}
                                    <Tag minimal round>
                                        {(node.nodeResources.memoryRequestsFraction * 100).toFixed(
                                            2
                                        )}
                                        %
                                    </Tag>
                                </TableCell>
                                <TableCell>
                                    {BytesTo.gigabytes(node.nodeResources.memoryRequests).toFixed(
                                        2
                                    )}{' '}
                                    /{' '}
                                    {BytesTo.gigabytes(node.nodeResources.memoryCapacity).toFixed(
                                        2
                                    )}{' '}
                                    <Tag minimal round>
                                        {(node.nodeResources.cpuRequestsFraction * 100).toFixed(2)}%
                                    </Tag>
                                </TableCell>
                                <TableCell>
                                    {node.nodeResources.allocatedPods} /{' '}
                                    {node.nodeResources.podCapacity}{' '}
                                    <Tag minimal round>
                                        {(node.nodeResources.allocatedPodFraction * 100).toFixed(2)}
                                        %
                                    </Tag>
                                </TableCell>
                            </TableRow>
                        ))}
                    </tbody>
                </Table>
            </Card>
        );
    }
}

export default NodeTable;

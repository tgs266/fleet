import React from 'react';
import { Card, Intent, Tag } from '@blueprintjs/core';
import TitledCard from '../../../components/Cards/TitledCard';
import { Node } from '../../../models/node.model';
import Label from '../../../components/Label';
import Text from '../../../components/Text/Text';
import LabeledText from '../../../components/LabeledText';
import TagList from '../../../components/TagList';
import NodeResourceInformation from '../NodeResourceInformation';
import PodTable from '../../../components/PodTable';
import { TableSort } from '../../../components/SortableTableHeaderCell';
import { Pagination } from '../../../models/component.model';

export default function Details(props: {
    node: Node;
    sort: TableSort;
    pagination: Pagination;
    setPage: (p: number) => void;
    setSort: (p: TableSort) => void;
}) {
    const { node, sort, pagination, setPage, setSort } = props;
    return (
        <>
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
                    <LabeledText style={{ marginLeft: '2em' }} label="CONTAINER RUNTIME VERSION">
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
                                    <Tag key={addr.address} intent={Intent.NONE} round>
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
                        sort={sort}
                        onSortChange={setSort}
                        paginationProps={{
                            ...pagination,
                            onPageChange: setPage,
                        }}
                    />
                </Card>
            </TitledCard>
        </>
    );
}

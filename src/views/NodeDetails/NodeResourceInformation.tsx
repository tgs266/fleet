import { Alignment, Tag } from '@blueprintjs/core';
import * as React from 'react';
import LabeledText from '../../components/LabeledText';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import Text from '../../components/Text/Text';
import TitledCard from '../../components/TitledCard';
import { NodeMeta } from '../../models/node.model';
import { BytesTo } from '../../utils/conversions';

const SPINNER_SIZE = 150;

export default function NodeResourceInformation(props: {
    nodeMeta: NodeMeta;
    style?: React.CSSProperties;
}) {
    const { nodeMeta } = props;
    return (
        <TitledCard style={props.style} title="Resource Allocations">
            <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <div>CPU</div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <SpinnerWrapper
                                className="blue-spinner"
                                value={nodeMeta.nodeResources.cpuRequestsFraction}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="REQUESTS">
                                    {(nodeMeta.nodeResources.cpuRequestsFraction * 100).toFixed(2)}%
                                </LabeledText>
                            </SpinnerWrapper>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '0.5em',
                                }}
                            >
                                <Text style={{ marginRight: '0.25em' }}>
                                    {nodeMeta.nodeResources.cpuRequests / 1000} /{' '}
                                    {nodeMeta.nodeResources.cpuCapacity / 1000}
                                </Text>
                                <Tag minimal>Cores</Tag>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <SpinnerWrapper
                                className="green-spinner"
                                value={nodeMeta.nodeResources.cpuLimitFraction}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="LIMIT">
                                    {(nodeMeta.nodeResources.cpuLimitFraction * 100).toFixed(2)}%
                                </LabeledText>
                            </SpinnerWrapper>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '0.5em',
                                }}
                            >
                                <Text style={{ marginRight: '0.25em' }}>
                                    {nodeMeta.nodeResources.cpuLimit / 1000} /{' '}
                                    {nodeMeta.nodeResources.cpuCapacity / 1000}
                                </Text>
                                <Tag minimal>Cores</Tag>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <div>Memory</div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <SpinnerWrapper
                                className="blue-spinner"
                                value={nodeMeta.nodeResources.memoryRequestsFraction}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="REQUESTS">
                                    {(nodeMeta.nodeResources.memoryRequestsFraction * 100).toFixed(
                                        2
                                    )}
                                    %
                                </LabeledText>
                            </SpinnerWrapper>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '0.5em',
                                }}
                            >
                                <Text style={{ marginRight: '0.25em' }}>
                                    {BytesTo.gigabytes(
                                        nodeMeta.nodeResources.memoryRequests
                                    ).toFixed(2)}{' '}
                                    /{' '}
                                    {BytesTo.gigabytes(
                                        nodeMeta.nodeResources.memoryCapacity
                                    ).toFixed(2)}
                                </Text>
                                <Tag minimal>GB</Tag>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <SpinnerWrapper
                                className="green-spinner"
                                value={nodeMeta.nodeResources.memoryRequestsFraction}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="LIMIT">
                                    {(nodeMeta.nodeResources.memoryRequestsFraction * 100).toFixed(
                                        2
                                    )}
                                    %
                                </LabeledText>
                            </SpinnerWrapper>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '0.5em',
                                }}
                            >
                                <Text style={{ marginRight: '0.25em' }}>
                                    {BytesTo.gigabytes(nodeMeta.nodeResources.memoryLimit).toFixed(
                                        2
                                    )}{' '}
                                    /{' '}
                                    {BytesTo.gigabytes(
                                        nodeMeta.nodeResources.memoryCapacity
                                    ).toFixed(2)}
                                </Text>
                                <Tag minimal>GB</Tag>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                        flexGrow: 1,
                    }}
                >
                    <div>Pods</div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexDirection: 'column',
                            }}
                        >
                            <SpinnerWrapper
                                className="blue-spinner"
                                value={nodeMeta.nodeResources.allocatedPodFraction}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="ALLOCATED">
                                    {(nodeMeta.nodeResources.allocatedPodFraction * 100).toFixed(2)}
                                    %
                                </LabeledText>
                            </SpinnerWrapper>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: '0.5em',
                                }}
                            >
                                <Text style={{ marginRight: '0.25em' }}>
                                    {nodeMeta.nodeResources.allocatedPods} /{' '}
                                    {nodeMeta.nodeResources.podCapacity}
                                </Text>
                                <Tag minimal>Pods</Tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TitledCard>
    );
}

import { Alignment, Tag } from '@blueprintjs/core';
import * as React from 'react';
import LabeledText from '../../components/LabeledText';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import Text from '../../components/Text/Text';
import TitledCard from '../../components/Cards/TitledCard';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';
import { BytesTo } from '../../utils/conversions';

const SPINNER_SIZE = 150;

function getLast<T>(arr: T[]) {
    return arr[arr.length - 1];
}

export default function ResourceCard(props: {
    metrics: {
        cpuUsage: PrometheusResponse<PrometheusRangeQueryResponse>;
        cpuCapacity: PrometheusResponse<PrometheusRangeQueryResponse>;
        memoryUsage: PrometheusResponse<PrometheusRangeQueryResponse>;
        memoryCapacity: PrometheusResponse<PrometheusRangeQueryResponse>;
        podUsage: PrometheusResponse<PrometheusRangeQueryResponse>;
        podCapacity: PrometheusResponse<PrometheusRangeQueryResponse>;
    };
}) {
    const memoryUnit = BytesTo.getUnit(
        Number(getLast<[number, string]>(props.metrics.memoryCapacity.data.result[0].values)[1])
    );
    const memoryCapacity = BytesTo.handleUnit(
        Number(getLast<[number, string]>(props.metrics.memoryCapacity.data.result[0].values)[1]),
        memoryUnit.magnitude
    );
    const memoryUsage = BytesTo.handleUnit(
        Number(getLast<[number, string]>(props.metrics.memoryUsage.data.result[0].values)[1]),
        memoryUnit.magnitude
    );

    const cpuCapacity = Number(
        getLast<[number, string]>(props.metrics.cpuCapacity.data.result[0].values)[1]
    );
    const cpuUsage = Number(
        getLast<[number, string]>(props.metrics.cpuUsage.data.result[0].values)[1]
    );

    const podCapacity = Number(
        getLast<[number, string]>(props.metrics.podCapacity.data.result[0].values)[1]
    );
    const podUsage = Number(
        getLast<[number, string]>(props.metrics.podUsage.data.result[0].values)[1]
    );

    return (
        <TitledCard title="Resource Allocations">
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
                                value={cpuUsage / cpuCapacity}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="ALLOCATED">
                                    {((cpuUsage / cpuCapacity) * 100).toFixed(2)}%
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
                                    {cpuUsage.toFixed(2)} / {cpuCapacity.toFixed(2)}
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
                                value={memoryUsage / memoryCapacity}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="ALLOCATED">
                                    {((memoryUsage / memoryCapacity) * 100).toFixed(2)}%
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
                                    {memoryUsage.toFixed(2)} / {memoryCapacity.toFixed(2)}
                                </Text>
                                <Tag minimal>{memoryUnit.suffix}</Tag>
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
                                value={podUsage / podCapacity}
                                size={SPINNER_SIZE}
                            >
                                <LabeledText alignment={Alignment.CENTER} label="ALLOCATED">
                                    {((podUsage / podCapacity) * 100).toFixed(2)}%
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
                                    {podUsage} / {podCapacity}
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

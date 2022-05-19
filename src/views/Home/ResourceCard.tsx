import { Alignment, Tag } from '@blueprintjs/core';
import * as React from 'react';
import LabeledText from '../../components/LabeledText';
import PieChart from '../../components/MetricCharts/PieChart';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import Text from '../../components/Text/Text';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';
import { BytesTo } from '../../utils/conversions';
import getLast from '../../utils/metrics';

const SPINNER_SIZE = 150;

function extractMetrics(metrics: {
    cpuUsage: PrometheusResponse<PrometheusRangeQueryResponse>;
    cpuCapacity: PrometheusResponse<PrometheusRangeQueryResponse>;
    memoryUsage: PrometheusResponse<PrometheusRangeQueryResponse>;
    memoryCapacity: PrometheusResponse<PrometheusRangeQueryResponse>;
    podUsage: PrometheusResponse<PrometheusRangeQueryResponse>;
    podCapacity: PrometheusResponse<PrometheusRangeQueryResponse>;
}) {
    const memoryUnit = BytesTo.getUnit(
        Number(getLast(metrics.memoryCapacity.data.result[0].values)[1])
    );
    const memoryCapacity = BytesTo.handleUnit(
        Number(getLast(metrics.memoryCapacity.data.result[0].values)[1]),
        memoryUnit.magnitude
    );
    const memoryUsage = BytesTo.handleUnit(
        Number(getLast(metrics.memoryUsage.data.result[0].values)[1]),
        memoryUnit.magnitude
    );

    const cpuCapacity = Number(getLast(metrics.cpuCapacity.data.result[0].values)[1]);
    const cpuUsage = Number(getLast(metrics.cpuUsage.data.result[0].values)[1]);

    const podCapacity = Number(getLast(metrics.podCapacity.data.result[0].values)[1]);
    const podUsage = Number(getLast(metrics.podUsage.data.result[0].values)[1]);
    return {
        memoryUnit,
        podUsage,
        podCapacity,
        cpuCapacity,
        cpuUsage,
        memoryUsage,
        memoryCapacity,
    };
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
    const {
        memoryUnit,
        podUsage,
        podCapacity,
        cpuCapacity,
        cpuUsage,
        memoryUsage,
        memoryCapacity,
    } = extractMetrics(props.metrics);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <PieChart
                emptyErrText="No Metrics Found"
                title="CPU"
                unit="Cores"
                innerLabel="ALLOCATED"
                value={cpuUsage}
                total={cpuCapacity}
            />
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
    );
}

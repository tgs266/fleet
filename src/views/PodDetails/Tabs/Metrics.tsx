import React from 'react';
import { Card } from '@blueprintjs/core';
import RangeQueryLineChartState from '../../../components/MetricCharts/RangeQueryLineChart';
import { JSONObjectType } from '../../../models/json.model';
import { PrometheusQueryResponse, PrometheusResponse } from '../../../models/prometheus.model';

export default function Metrics(props: {
    metricsData: JSONObjectType<PrometheusResponse<PrometheusQueryResponse>>;
}) {
    const { metricsData } = props;
    return (
        <>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    marginBottom: '1em',
                }}
            >
                <Card style={{ width: 'calc(50% - 0.5em)', marginRight: '0.5em' }}>
                    <RangeQueryLineChartState
                        data={{
                            memoryUsage: metricsData.memoryUsage,
                        }}
                        labels={{ memoryUsage: 'Memory Usage' }}
                        height={150}
                        bytes
                    />
                </Card>
                <Card style={{ width: 'calc(50% - 0.5em)', marginLeft: '0.5em' }}>
                    <RangeQueryLineChartState
                        data={{
                            cpuUsage: metricsData.cpuUsage,
                        }}
                        height={150}
                        labels={{ cpuUsage: 'CPU Usage' }}
                    />
                </Card>
            </div>
            <Card style={{ marginBottom: '1em' }}>
                <RangeQueryLineChartState
                    data={{
                        networkRecieved: metricsData.networkRecieved,
                        networkTransmitted: metricsData.networkTransmitted,
                    }}
                    height={100}
                    labels={{ networkRecieved: 'Recieved', networkTransmitted: 'Transmitted' }}
                    bytes
                />
            </Card>
        </>
    );
}

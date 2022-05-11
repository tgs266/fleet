import React from 'react';
import RangeQueryLineChart from '../../../components/MetricCharts/RangeQueryLineChart';
import { JSONObjectType } from '../../../models/json.model';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../../models/prometheus.model';
import TitledCard from '../../../components/Cards/TitledCard';

export default function Metrics(props: {
    metricsData: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
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
                <TitledCard
                    titleMarginBottom="0"
                    title="CPU Usage"
                    style={{ width: 'calc(50% - 0.5em)', marginLeft: '0.5em' }}
                >
                    <RangeQueryLineChart
                        data={{
                            cpuUsage: metricsData.cpuUsage,
                        }}
                        height="215px"
                        labels={{ cpuUsage: 'CPU Usage' }}
                    />
                </TitledCard>
                <TitledCard
                    titleMarginBottom="0"
                    title="Memory Usage"
                    style={{ width: 'calc(50% - 0.5em)', marginRight: '0.5em' }}
                >
                    <RangeQueryLineChart
                        data={{
                            memoryUsage: metricsData.memoryUsage,
                        }}
                        labels={{ memoryUsage: 'Memory Usage' }}
                        height="215px"
                        bytes
                    />
                </TitledCard>
            </div>
            <TitledCard titleMarginBottom="0" title="Network Usage" style={{ marginBottom: '1em' }}>
                <RangeQueryLineChart
                    data={{
                        networkRecieved: metricsData.networkRecieved,
                        networkTransmitted: metricsData.networkTransmitted,
                    }}
                    height="215px"
                    labels={{ networkRecieved: 'Recieved', networkTransmitted: 'Transmitted' }}
                    bytes
                    legend
                />
            </TitledCard>
        </>
    );
}

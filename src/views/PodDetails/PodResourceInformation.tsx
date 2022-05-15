import * as React from 'react';
import TitledCard from '../../components/Cards/TitledCard';
import { BytesTo, CPU } from '../../utils/conversions';
import { JSONObjectType } from '../../models/json.model';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../models/prometheus.model';
import getLast from '../../utils/metrics';
import PieChart from '../../components/MetricCharts/PieChart';

const extractVal = (md: PrometheusResponse<PrometheusRangeQueryResponse>) => {
    if (!md) {
        return null;
    }
    return md.data.result.length ? Number(getLast(md.data.result[0].values)[1]) : null;
};

export default function PodResourceInformation(props: {
    metricsData: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
    style?: React.CSSProperties;
}) {
    const { metricsData } = props;
    let cpuUnit = { magnitude: 1000, suffix: 'Millicores' };
    let memoryUnit = BytesTo.getUnit(null);
    let cpuUsage = null;
    let cpuRequests = null;
    let cpuLimits = null;

    let memoryUsage = null;
    let memoryRequests = null;
    let memoryLimits = null;
    if (metricsData) {
        cpuUsage = extractVal(props.metricsData.cpuUsage);
        cpuRequests = extractVal(props.metricsData.cpuRequests);
        cpuLimits = extractVal(props.metricsData.cpuLimits);

        memoryUsage = extractVal(props.metricsData.memoryUsage);
        memoryRequests = extractVal(props.metricsData.memoryRequests);
        memoryLimits = extractVal(props.metricsData.memoryLimits);

        cpuUnit = CPU.getUnit(cpuUsage);
        memoryUnit = BytesTo.getUnit(Math.max(memoryUsage, memoryRequests, memoryLimits));
    }

    return (
        <TitledCard style={props.style} title="Resource Usage">
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
                        <PieChart
                            emptyErrText="No Requests Defined"
                            innerLabel={cpuRequests ? 'REQUESTS' : ''}
                            unit={cpuUnit.suffix}
                            value={CPU.handleUnit(cpuUsage, cpuUnit.magnitude)}
                            total={CPU.handleUnit(cpuRequests, cpuUnit.magnitude)}
                        />
                        <PieChart
                            spinnerClassName="green-spinner"
                            emptyErrText="No Limits Defined"
                            innerLabel={cpuLimits ? 'LIMITS' : ''}
                            unit={cpuUnit.suffix}
                            value={CPU.handleUnit(cpuUsage, cpuUnit.magnitude)}
                            total={CPU.handleUnit(cpuLimits, cpuUnit.magnitude)}
                        />
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
                        <PieChart
                            emptyErrText="No Requests Defined"
                            innerLabel={memoryRequests ? 'REQUESTS' : ''}
                            unit={memoryUnit.suffix}
                            value={BytesTo.handleUnit(memoryUsage, memoryUnit.magnitude)}
                            total={BytesTo.handleUnit(memoryRequests, memoryUnit.magnitude)}
                        />
                        <PieChart
                            spinnerClassName="green-spinner"
                            emptyErrText="No Limits Defined"
                            innerLabel={memoryLimits ? 'LIMITS' : ''}
                            unit={memoryUnit.suffix}
                            value={BytesTo.handleUnit(memoryUsage, memoryUnit.magnitude)}
                            total={BytesTo.handleUnit(memoryLimits, memoryUnit.magnitude)}
                        />
                    </div>
                </div>
            </div>
        </TitledCard>
    );
}

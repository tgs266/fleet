import React from 'react';
import TitledCard from '../../../components/Cards/TitledCard';
import ConditionTable from '../../../components/ConditionTable';
import PodContainerTable from '../../../components/PodContainerTable';
import { JSONObjectType } from '../../../models/json.model';
import { Pod } from '../../../models/pod.model';
import { PrometheusRangeQueryResponse, PrometheusResponse } from '../../../models/prometheus.model';
import PodEvents from '../PodEvents';
import PodResourceInformation from '../PodResourceInformation';

export default function Details(props: {
    pod: Pod;
    metricsData: JSONObjectType<PrometheusResponse<PrometheusRangeQueryResponse>>;
}) {
    const { pod } = props;
    return (
        <>
            <div style={{ marginBottom: '1em' }}>
                <PodResourceInformation metricsData={props.metricsData} />
            </div>

            <div style={{ marginBottom: '1em' }}>
                <ConditionTable conditions={pod.conditions} />
            </div>

            <div style={{ marginBottom: '1em' }}>
                <TitledCard title="Containers">
                    <PodContainerTable pod={pod} />
                </TitledCard>
            </div>

            <div style={{ marginBottom: '1em' }}>
                <PodEvents podName={pod.name} namespace={pod.namespace} />
            </div>
        </>
    );
}

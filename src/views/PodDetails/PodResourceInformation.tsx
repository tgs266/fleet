import { Alignment, Tag } from '@blueprintjs/core';
import { Classes, Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import LabeledText from '../../components/LabeledText';
import SpinnerWrapper from '../../components/SpinnerWrapper';
import Text from '../../components/Text/Text';
import TitledCard from '../../components/Cards/TitledCard';
import { PodResources } from '../../models/pod.model';
import { BytesTo } from '../../utils/conversions';

const SPINNER_SIZE = 150;

const createSpinnerActual = (className: string, label: string, fraction?: number) => (
    <SpinnerWrapper className={className} value={fraction} size={SPINNER_SIZE}>
        <LabeledText alignment={Alignment.CENTER} label={label}>
            {!fraction || fraction === -1 ? null : `${(fraction * 100).toFixed(2)}%s`}
        </LabeledText>
    </SpinnerWrapper>
);

const createSpinnerBottomLabel = (label: string, usage?: number, capacity?: number) => {
    if (capacity <= 0) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5em' }}>
                <Text style={{ marginRight: '0.25em' }}>No allocation defined</Text>
            </div>
        );
    }
    return (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5em' }}>
            <Text style={{ marginRight: '0.25em' }}>
                {usage >= 0 ? (
                    usage.toFixed(2)
                ) : (
                    <Tooltip2 content="No usage found" className={Classes.TOOLTIP2_INDICATOR}>
                        ?
                    </Tooltip2>
                )}{' '}
                / {capacity.toFixed(2)}
            </Text>
            <Tag minimal>{label}</Tag>
        </div>
    );
};
const createSpinner = (
    className: string,
    spinnerLabel: string,
    typeLabel: string,
    usage?: number,
    capacity?: number,
    fraction?: number
) => (
    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        {createSpinnerActual(className, spinnerLabel, fraction)}
        {createSpinnerBottomLabel(typeLabel, usage, capacity)}
    </div>
);

export default function PodResourceInformation(props: {
    podResources: PodResources;
    style?: React.CSSProperties;
}) {
    const { podResources } = props;
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
                        {createSpinner(
                            'blue-spinner',
                            'REQUESTS',
                            'Cores',
                            podResources.cpuUsage / 1000,
                            podResources.cpuRequests / 1000,
                            podResources.cpuUsageRequestsFraction
                        )}
                        {createSpinner(
                            'green-spinner',
                            'LIMIT',
                            'Cores',
                            podResources.cpuUsage / 1000,
                            podResources.cpuLimit / 1000,
                            podResources.cpuUsageLimitFraction
                        )}
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
                        {createSpinner(
                            'blue-spinner',
                            'REQUESTS',
                            'GB',
                            BytesTo.gigabytes(podResources.memoryUsage),
                            BytesTo.gigabytes(podResources.memoryRequests),
                            podResources.cpuUsageRequestsFraction
                        )}
                        {createSpinner(
                            'green-spinner',
                            'LIMIT',
                            'GB',
                            BytesTo.gigabytes(podResources.memoryUsage),
                            BytesTo.gigabytes(podResources.memoryLimit),
                            podResources.cpuUsageLimitFraction
                        )}
                    </div>
                </div>
            </div>
        </TitledCard>
    );
}

import { Alignment, Tag } from '@blueprintjs/core';
import React from 'react';
import LabeledText from './LabeledText';
import SpinnerWrapper from './SpinnerWrapper';
import Text from './Text/Text';

const SPINNER_SIZE = 150;

export default function PieChart(props: {
    title: string;
    unit: string;
    innerLabel: string;
    value: number;
    total: number;
}) {
    const { value, total } = props;
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                flexGrow: 1,
            }}
        >
            <div>{props.title}</div>
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
                        value={value / total}
                        size={SPINNER_SIZE}
                    >
                        <LabeledText alignment={Alignment.CENTER} label={props.innerLabel}>
                            {((value / total) * 100).toFixed(2)}%
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
                            {value.toFixed(2)} / {total.toFixed(2)}
                        </Text>
                        <Tag minimal>{props.unit}</Tag>
                    </div>
                </div>
            </div>
        </div>
    );
}

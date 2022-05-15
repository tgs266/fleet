import { Alignment, Tag } from '@blueprintjs/core';
import React from 'react';
import LabeledText from '../LabeledText';
import SpinnerWrapper from '../SpinnerWrapper';
import Text from '../Text/Text';

const SPINNER_SIZE = 150;

const getString = (value: number, total: number) => {
    const valueStr = value != null ? value.toFixed(2) : '?';
    const totalStr = total != null ? total.toFixed(2) : '?';
    return `${valueStr} / ${totalStr}`;
};

const getValue = (value: number, total: number) => {
    if (!total) {
        if (!value) {
            return 0;
        }
        return 0;
    }
    return value / total;
};

const getInner = (value: number, total: number, emptyErrText: string) => {
    if (!total) {
        if (!value) {
            return emptyErrText;
        }
        return emptyErrText;
    }
    return `${((value / total) * 100).toFixed(2)}%`;
};

export default function PieChart(props: {
    title?: string;
    spinnerClassName?: string;
    unit: string;
    innerLabel?: string;
    value: number;
    emptyErrText: string;
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
                        className={props.spinnerClassName ? 'blue-spinner' : props.spinnerClassName}
                        value={getValue(value, total)}
                        size={SPINNER_SIZE}
                    >
                        <LabeledText
                            style={{ textAlign: 'center' }}
                            alignment={Alignment.CENTER}
                            label={props.innerLabel}
                        >
                            {getInner(value, total, props.emptyErrText)}
                        </LabeledText>
                    </SpinnerWrapper>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '0.5em',
                        }}
                    >
                        <Text style={{ marginRight: '0.25em' }}>{getString(value, total)}</Text>
                        <Tag minimal>{props.unit}</Tag>
                    </div>
                </div>
            </div>
        </div>
    );
}

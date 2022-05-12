/* eslint-disable no-param-reassign */
/* eslint-disable indent */
import { Alignment } from '@blueprintjs/core';
import * as React from 'react';
import Text from './Text/Text';

const getFlexAlignment = (alignment?: Alignment) => {
    switch (alignment) {
        case Alignment.LEFT:
            return 'flex-start';
        case Alignment.RIGHT:
            return 'flex-end';
        case Alignment.CENTER:
            return 'center';
        default:
            return 'flex-start';
    }
};

export default function Label(props: {
    alignment?: Alignment;
    style?: React.CSSProperties;
    children: React.ReactNode;
    label: string;
    small?: boolean;
    muted?: boolean;
}) {
    let small = false;
    if (props.small === null || props.small === undefined) {
        small = true;
    }
    const alignItems = getFlexAlignment(props.alignment);
    return (
        <div style={{ ...props.style, display: 'flex', flexDirection: 'column', alignItems }}>
            <Text small={small} muted={props.muted}>
                {props.label}
            </Text>
            {props.children}
        </div>
    );
}

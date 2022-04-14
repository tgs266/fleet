/* eslint-disable indent */
import { Alignment, Colors } from '@blueprintjs/core';
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
}) {
    const alignItems = getFlexAlignment(props.alignment);
    return (
        <div style={{ ...props.style, display: 'flex', flexDirection: 'column', alignItems }}>
            <Text small style={{ color: Colors.GRAY2 }}>
                {props.label}
            </Text>
            {props.children}
        </div>
    );
}

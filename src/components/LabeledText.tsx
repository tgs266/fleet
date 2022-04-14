import { Alignment } from '@blueprintjs/core';
import * as React from 'react';
import Label from './Label';
import Text, { ITextProps } from './Text/Text';

export default function LabeledText(props: {
    alignment?: Alignment;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    label: string;
    textProps?: ITextProps;
}) {
    return (
        <Label alignment={props.alignment} label={props.label} style={props.style}>
            <Text {...props.textProps}>{props.children}</Text>
        </Label>
    );
}

import * as React from 'react';
import { Tag } from '@blueprintjs/core';

export default function TagList(props: {
    children: any;
    chipStyle?: React.CSSProperties;
    style?: React.CSSProperties;
    spacing?: string;
}) {
    return (
        <div
            style={{
                ...props.style,
                display: 'flex',
                flexWrap: 'wrap',
                margin: `-${props.spacing}` || '-0.25em',
                alignItems: 'center',
            }}
        >
            {props.children.map((child: Tag, idx: number) => (
                <div
                    style={{
                        ...props.chipStyle,
                        margin: props.spacing || '0.25em',
                        marginLeft: idx !== 0 ? null : 0,
                    }}
                >
                    {child}
                </div>
            ))}
        </div>
    );
}

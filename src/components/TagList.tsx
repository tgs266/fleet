import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

export default function TagList(props: {
    children: PropTypes.ReactNodeArray;
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
            {props.children.map((child, idx) => (
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

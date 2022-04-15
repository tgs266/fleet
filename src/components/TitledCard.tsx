import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Card } from '@blueprintjs/core';

export default function TitledCard(props: {
    title: PropTypes.ReactNodeLike;
    rightElement?: React.ReactNode;
    style?: React.CSSProperties;
    titleMarginBottom?: string;
    children?: PropTypes.ReactNodeLike;
}) {
    return (
        <Card style={{ ...props.style }}>
            <div
                style={{
                    display: 'flex',
                    marginBottom: props.titleMarginBottom || '1em',
                    alignItems: 'center',
                }}
            >
                <h3 style={{ margin: 0 }}>{props.title}</h3>
                <div style={{ flexGrow: 1 }} />
                {props.rightElement}
            </div>
            {props.children}
        </Card>
    );
}

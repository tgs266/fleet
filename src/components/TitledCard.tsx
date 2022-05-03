import React from 'react';
import { Card } from '@blueprintjs/core';

export interface ITitledCardProps {
    title: React.ReactNode;
    rightElement?: React.ReactNode;
    style?: React.CSSProperties;
    titleMarginBottom?: string;
    children?: React.ReactNode;
}

export default function TitledCard(props: ITitledCardProps) {
    return (
        <Card style={{ ...props.style }}>
            <div
                style={{
                    display: 'flex',
                    marginBottom: props.titleMarginBottom || '1em',
                    alignItems: 'center',
                }}
            >
                <h3 data-testid="titledcard-title" style={{ margin: 0 }}>
                    {props.title}
                </h3>
                <div style={{ flexGrow: 1 }} />
                {props.rightElement}
            </div>
            {props.children}
        </Card>
    );
}

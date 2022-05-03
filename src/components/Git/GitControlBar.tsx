import { Card, Tab, Tabs } from '@blueprintjs/core';
import React from 'react';

export default function GitControlBar(props: { style?: React.CSSProperties }) {
    return (
        <Card
            style={{
                paddingLeft: '1em',
                paddingRight: '1em',
                paddingTop: 0,
                paddingBottom: 0,
                margin: '1em',
                ...props.style,
            }}
        >
            <Tabs large>
                <Tab id="1" title="History" />
                <Tab id="2" title="Pull Requests" />
            </Tabs>
        </Card>
    );
}

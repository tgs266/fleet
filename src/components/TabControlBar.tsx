import { Card, Tab, Tabs } from '@blueprintjs/core';
import React from 'react';

export default function TabControlBar(props: {
    tabs: string[];
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
    style?: React.CSSProperties;
}) {
    return (
        <Card style={{ ...props.style, padding: 0 }}>
            <Tabs large selectedTabId={props.selectedTab} onChange={props.setSelectedTab}>
                {props.tabs.map((t) => (
                    <Tab
                        data-testid={`tab-${t}`}
                        key={t}
                        id={t}
                        style={{
                            marginRight: 0,
                            display: 'flex',
                            justifyContent: 'center',
                            width: `${100 / props.tabs.length}%`,
                        }}
                        title={t}
                    />
                ))}
            </Tabs>
        </Card>
    );
}

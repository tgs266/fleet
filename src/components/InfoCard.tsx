import { Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import TitledCard from './TitledCard';

export default function InfoCard(props: {
    rightElement?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    title: string;
    statuColor?: string;
    statusHover?: string | JSX.Element;
}) {
    const getStatusIndicator = () => {
        if (props.statuColor === null) {
            return null;
        }
        const statusHtml = <Icon color={props.statuColor} icon="full-circle" size={14} />;
        if (props.statusHover) {
            return <Tooltip2 content={props.statusHover}>{statusHtml}</Tooltip2>;
        }
        return statusHtml;
    };

    return (
        <TitledCard
            title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h3 data-testid="infocard-title" style={{ margin: 0, marginRight: '0.25em' }}>
                        {props.title}
                    </h3>
                    {props.statuColor && getStatusIndicator()}
                </div>
            }
            style={{ ...props.style }}
            rightElement={props.rightElement}
        >
            {props.children}
        </TitledCard>
    );
}

import { Icon } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { BaseMeta } from '../../models/base';
import AnnotationsTagList from '../AnnotationsTagList';
import LabelsTagList from '../LabelsTagList';
import TitledCard from './TitledCard';

export default function InfoCard(props: {
    rightElement?: React.ReactNode;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    title: string;
    statuColor?: string;
    statusHover?: string | JSX.Element;
    object?: BaseMeta;
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
            {props.object && (
                <>
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <LabelsTagList obj={props.object} />
                    </div>
                    <div style={{ marginTop: '0.25em', display: 'flex' }}>
                        <AnnotationsTagList obj={props.object} />
                    </div>
                </>
            )}
        </TitledCard>
    );
}

/* eslint-disable no-param-reassign */
import { Tab, Tabs } from '@blueprintjs/core';
import React from 'react';
import { BaseMeta } from '../models/base';
import AnnotationsTagList from './AnnotationsTagList';
import InfoCard, { IInfoCardProps } from './InfoCard';
import LabelsTagList from './LabelsTagList';

export interface ITab {
    id: string;
    name: string;
}

export interface IResourceTitleCardProps extends IInfoCardProps {
    obj: BaseMeta;
    children: React.ReactNode;
    tabs?: ITab[];
    selectedTab?: string;
    onTabChange?: (tabId: string) => void;
}

export default function ResourceInfoCard(props: IResourceTitleCardProps) {
    let rightEle = props.rightElement;
    if (props.tabs && props.onTabChange) {
        rightEle = (
            <div>
                <div style={{ marginTop: '-3px' }}>
                    <Tabs onChange={props.onTabChange} selectedTabId={props.selectedTab}>
                        {props.tabs.map((tab) => (
                            <Tab
                                key={tab.id}
                                id={tab.id}
                                title={tab.name}
                                style={{ fontSize: '18px' }}
                            />
                        ))}
                    </Tabs>
                </div>
                {props.rightElement}
            </div>
        );
    }

    return (
        <InfoCard
            title={props.title}
            style={props.style}
            rightElement={rightEle}
            statuColor={props.statuColor}
            statusHover={props.statusHover}
        >
            {props.children}
            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                <LabelsTagList obj={props.obj} />
            </div>
            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                <AnnotationsTagList obj={props.obj} />
            </div>
        </InfoCard>
    );
}

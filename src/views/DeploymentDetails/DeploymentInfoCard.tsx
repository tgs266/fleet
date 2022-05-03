/* eslint-disable indent */
import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import AgeText from '../../components/AgeText';
import LabeledText from '../../components/LabeledText';
import ResourceTitleCard from '../../components/ResourceTitleCard';
import { Deployment } from '../../models/deployment.model';

export default function DeploymentInfoCard(props: {
    deployment: Deployment;
    selectedTab?: string;
    onTabChange?: (id: string) => void;
}) {
    const { deployment } = props;
    let color;
    switch (deployment.readyReplicas) {
        case 0:
            color = Colors.RED4;
            break;
        case deployment.replicas:
            color = Colors.GREEN4;
            break;
        default:
            color = Colors.GOLD5;
            break;
    }

    return (
        <div style={{ margin: '1em' }}>
            <ResourceTitleCard
                obj={deployment}
                title={deployment.name}
                statuColor={color}
                tabs={[
                    {
                        name: 'Details',
                        id: 'dt',
                    },
                    {
                        name: 'Git',
                        id: 'gt',
                    },
                ]}
                onTabChange={props.onTabChange}
                selectedTab={props.selectedTab}
            >
                <div style={{ marginTop: '0.25em', display: 'flex' }}>
                    <LabeledText label="NAMESPACE">{deployment.namespace}</LabeledText>
                    <LabeledText style={{ marginLeft: '2em' }} label="AGE">
                        <AgeText value={deployment.createdAt} hr />
                    </LabeledText>
                    <LabeledText style={{ marginLeft: '2em' }} label="CREATED AT">
                        <AgeText value={deployment.createdAt} />
                    </LabeledText>
                    <LabeledText style={{ marginLeft: '2em' }} label="UID">
                        {deployment.uid}
                    </LabeledText>
                </div>
            </ResourceTitleCard>
        </div>
    );
}

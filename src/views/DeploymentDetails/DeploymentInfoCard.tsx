/* eslint-disable indent */
import { Colors } from '@blueprintjs/core';
import * as React from 'react';
import AgeText from '../../components/AgeText';
import AnnotationsTagList from '../../components/AnnotationsTagList';
import InfoCard from '../../components/Cards/InfoCard';
import LabeledText from '../../components/LabeledText';
import LabelsTagList from '../../components/LabelsTagList';
import { Deployment } from '../../models/deployment.model';

export default function DeploymentInfoCard(props: { deployment: Deployment }) {
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
            <InfoCard title={deployment.name} statuColor={color}>
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
                <div style={{ marginTop: '0.25em', display: 'flex' }}>
                    <LabelsTagList obj={deployment} />
                </div>
                <div style={{ marginTop: '0.25em', display: 'flex' }}>
                    <AnnotationsTagList obj={deployment} />
                </div>
            </InfoCard>
        </div>
    );
}

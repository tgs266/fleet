/* eslint-disable indent */
import { Colors, Tag, Intent } from '@blueprintjs/core';
import * as React from 'react';
import AgeText from '../../components/AgeText';
import InfoCard from '../../components/InfoCard';
import Label from '../../components/Label';
import LabeledText from '../../components/LabeledText';
import TagList from '../../components/TagList';
import Text from '../../components/Text/Text';
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
                    <Label label="LABELS">
                        {deployment.labels && (
                            <TagList>
                                {Object.keys(deployment.labels).map((key) => (
                                    <Tag
                                        key={key}
                                        style={{ marginRight: '0.25' }}
                                        intent={Intent.NONE}
                                        round
                                    >
                                        <Text small>
                                            {key}: {deployment.labels[key]}
                                        </Text>
                                    </Tag>
                                ))}
                            </TagList>
                        )}
                    </Label>
                </div>
                <div style={{ marginTop: '0.25em', display: 'flex' }}>
                    <Label label="ANNOTATIONS">
                        {deployment.annotations && (
                            <TagList>
                                {Object.keys(deployment.annotations).map((key) => (
                                    <Tag
                                        key={key}
                                        style={{ marginRight: '0.25' }}
                                        intent={Intent.NONE}
                                        round
                                    >
                                        <Text small>
                                            {key}: {deployment.annotations[key]}
                                        </Text>
                                    </Tag>
                                ))}
                            </TagList>
                        )}
                    </Label>
                </div>
            </InfoCard>
        </div>
    );
}

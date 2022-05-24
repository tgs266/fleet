/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import { Colors, Tag, Intent } from '@blueprintjs/core';
import * as React from 'react';
import InfoCard from '../../components/Cards/InfoCard';
import Label from '../../components/Label';
import LabeledText from '../../components/LabeledText';
import PortTag from '../../components/Port/PortTag';
import TagList from '../../components/TagList';
import Text from '../../components/Text/Text';
import { Container } from '../../models/container.model';
import CONSTANTS from '../../utils/constants';

export default function PodContainerInfoCard(props: { container: Container }) {
    const { container } = props;
    let color;
    switch (container.state) {
        case CONSTANTS.status.TERMINATED_STATUS:
            color = Colors.RED4;
            break;
        case CONSTANTS.status.RUNNING_STATUS:
            color = Colors.GREEN4;
            break;
        default:
            color = Colors.GOLD5;
            break;
    }

    return (
        <InfoCard title={container.name} statuColor={color} statusHover={container.state}>
            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                <LabeledText label="IMAGE NAME">{container.image.name}</LabeledText>
                <LabeledText style={{ marginLeft: '2em' }} label="IMAGE TAG">
                    {container.image.tag}
                </LabeledText>
                <LabeledText style={{ marginLeft: '2em' }} label="IMAGE PULL POLICY">
                    {container.imagePullPolicy}
                </LabeledText>
            </div>
            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                <Label label="PORTS">
                    {container.ports &&
                        container.ports.map((port, key) => (
                            <PortTag
                                key={key}
                                style={{ marginRight: '0.25' }}
                                fontSize={14}
                                port={port}
                            />
                        ))}
                </Label>
            </div>
            <div style={{ marginTop: '0.25em', display: 'flex' }}>
                <Label label="ENVIRONMENT VARIABLES">
                    <TagList>
                        {container.envVars &&
                            container.envVars.map((variable, key) => (
                                <Tag
                                    key={key}
                                    style={{ marginRight: '0.25' }}
                                    intent={Intent.NONE}
                                    round
                                >
                                    <Text small>
                                        {variable.name}: {variable.value}
                                    </Text>
                                </Tag>
                            ))}
                    </TagList>
                </Label>
            </div>
        </InfoCard>
    );
}

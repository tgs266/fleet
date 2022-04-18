/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import { Colors, Tag, Intent } from '@blueprintjs/core';
import * as React from 'react';
import InfoCard from '../../components/InfoCard';
import Label from '../../components/Label';
import LabeledText from '../../components/LabeledText';
import PortTag from '../../components/Port/PortTag';
import Text from '../../components/Text/Text';
import { Container } from '../../models/container.model';

export default function PodContainerInfoCard(props: { container: Container }) {
    const { container } = props;
    let color = Colors.GREEN4;
    switch (container.state) {
        case 'Terminated':
            color = Colors.RED4;
            break;
        case 'Running':
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
                </Label>
            </div>
        </InfoCard>
    );
}

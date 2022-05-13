/* eslint-disable indent */
import * as React from 'react';
import TitledCard from '../../components/Cards/TitledCard';
import { ContainerSpec } from '../../models/container.model';
import LabeledText from '../../components/LabeledText';

export default function ContainerSpecDetailsInfoCard(props: {
    container: ContainerSpec;
    rightElement: JSX.Element;
}) {
    const { container, rightElement } = props;

    return (
        <TitledCard title={container.name} rightElement={rightElement}>
            <div style={{ display: 'flex' }}>
                <LabeledText label="IMAGE LABEL">{container.image.name}</LabeledText>
                <LabeledText label="IMAGE TAG" style={{ marginLeft: '2em' }}>
                    {container.image.tag}
                </LabeledText>
            </div>
        </TitledCard>
    );
}

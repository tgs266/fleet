/* eslint-disable indent */
import * as React from 'react';
import { Card } from '@blueprintjs/core';
import { ContainerSpec } from '../../models/container.model';
import LabelInputGroup from '../../components/LabelInputGroup';
import ImageList from '../../components/ImageList';

export default function BasicContainerSpecEdit(props: {
    containerSpec: ContainerSpec;
    onChange: (path: string, value: any) => void;
}) {
    const { containerSpec, onChange } = props;

    return (
        <Card style={{ margin: '1em', marginTop: '0' }}>
            <LabelInputGroup
                fill
                label="Name"
                value={containerSpec.name}
                onChange={(e) => onChange('name', e.target.value)}
            />
            <ImageList containerSpec={containerSpec} onChange={onChange} />
            {/* <LabelInputGroup fill label="Image" value={containerSpec.image} onChange={(e) => onChange("image", e.target.value)} /> */}
        </Card>
    );
}

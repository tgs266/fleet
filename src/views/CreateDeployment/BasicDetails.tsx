import { Card } from '@blueprintjs/core';
import * as React from 'react';
import LabelInputGroup from '../../components/LabelInputGroup';
import LabelSlider from '../../components/LabelSlider';
import { CreateApp } from '../../models/app.model';

// need to provide a onChange handler
// namespace selector
export default function BasicDetails(props: {
    app: CreateApp;
    onChange: (path: string, value: any) => void;
}) {
    return (
        <Card>
            <LabelInputGroup
                data-testid="name-input"
                label="Name"
                value={props.app.name}
                onChange={(e) => {
                        props.onChange('name', e.target.value);
                    }}
                fill
                />
            <LabelInputGroup
                data-testid="namespace-input"
                label="Namespace"
                value={props.app.namespace}
                onChange={(e) => {
                        props.onChange('namespace', e.target.value);
                    }}
                fill
                />
            <LabelSlider
                label="Replicas"
                min={1}
                max={10}
                stepSize={1}
                value={props.app.replicas}
                onChange={(e) => {
                        props.onChange('replicas', e);
                    }}
                />
        </Card>
    );
}

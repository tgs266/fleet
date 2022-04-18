import { Button, Intent, Tag } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import React, { useState } from 'react';
import Label from '../Label';
import LabeledText from '../LabeledText';
import TagList from '../TagList';
import Text from '../Text/Text';
import TitledCard from '../TitledCard';
import { FleetSprite } from './helper';

// eslint-disable-next-line consistent-return
const getLink = (type: string, child: FleetSprite) => {
    switch (type) {
        case 'pod':
        case 'deployment':
            return `/#/${type}s/${child.data.meta.namespace}/${child.data.meta.name}`;
        case 'container':
            return `/#/pods/${child.data.meta.namespace}/${child.data.meta.details.pod}/containers/${child.data.meta.name}`;
        default:
            return '';
    }
};

export default function FleetPopover(props: { type: string; child: FleetSprite }) {
    const [isOpen, setIsOpen] = useState(true);
    const { child } = props;

    return (
        <Popover2
            isOpen={isOpen}
            onClose={() => {
                setIsOpen(false);
            }}
            content={
                <TitledCard
                    title={child.data.meta.name}
                    rightElement={
                        <a href={getLink(props.type, props.child)} target="_blank" rel="noreferrer">
                            <Button style={{ marginLeft: '0.5em' }} icon="eye-open" />
                        </a>
                    }
                >
                    <LabeledText label="UID" style={{ marginBottom: '0.25em' }}>
                        {child.data.meta.uid}
                    </LabeledText>
                    <div style={{ display: 'flex', marginBottom: '0.25em' }}>
                        <LabeledText label="TYPE" style={{ marginRight: '2em' }}>
                            {props.type}
                        </LabeledText>
                        <LabeledText label="NAMESPACE">{child.data.meta.namespace}</LabeledText>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '0.25em' }}>
                        <LabeledText label="STATUS" style={{ marginRight: '2em' }}>
                            {child.data.status.value}
                        </LabeledText>
                        <LabeledText label="REASON">{child.data.status.reason}</LabeledText>
                    </div>
                    <Label label="DETAILS">
                        {child.data.meta.details && (
                            <TagList>
                                {Object.keys(child.data.meta.details).map((key) => (
                                    <Tag style={{ marginRight: '0.25' }} intent={Intent.NONE} round>
                                        <Text small>
                                            {key}: {child.data.meta.details[key]}
                                        </Text>
                                    </Tag>
                                ))}
                            </TagList>
                        )}
                    </Label>
                </TitledCard>
            }
        >
            <div />
        </Popover2>
    );
}

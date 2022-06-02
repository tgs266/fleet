/* eslint-disable react/no-array-index-key */
import { Intent, Tag } from '@blueprintjs/core';
import React from 'react';
import { BaseMeta } from '../models/base';
import Label from './Label';
import TagList from './TagList';
import Text from './Text/Text';

export default function LabelsTagList(props: { obj: BaseMeta }) {
    return (
        <Label label="LABELS">
            <TagList>
                {props.obj.labels &&
                    Object.keys(props.obj.labels).map((key) => (
                        <Tag key={key} intent={Intent.NONE} round>
                            <Text small>
                                {key}: {props.obj.labels[key]}
                            </Text>
                        </Tag>
                    ))}
            </TagList>
        </Label>
    );
}

import { Intent, Tag } from '@blueprintjs/core';
import React from 'react';
import { BaseMeta } from '../models/base';
import Label from './Label';
import TagList from './TagList';
import Text from './Text/Text';

export default function AnnotationsTagList(props: { obj: BaseMeta }) {
    return (
        <Label label="ANNOTATIONS">
            <TagList>
                {props.obj.annotations &&
                    Object.keys(props.obj.annotations).map((key) => (
                        <Tag key={key} style={{ marginRight: '0.25' }} intent={Intent.NONE} round>
                            <Text small>
                                {key}: {props.obj.annotations[key]}
                            </Text>
                        </Tag>
                    ))}
            </TagList>
        </Label>
    );
}

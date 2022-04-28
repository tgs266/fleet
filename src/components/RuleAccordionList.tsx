/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Tag, Intent, Card } from '@blueprintjs/core';
import { Rule } from '../models/base';
import Label from './Label';
import TagList from './TagList';
import Text from './Text/Text';
import Accordion from './Accordion';

export default function RuleAccordionList(props: { rules: Rule[]; style?: React.CSSProperties }) {
    const { rules, style } = props;

    return (
        <div style={style}>
            <Card style={{ borderRadius: '3px 3px 0px 0px' }}>
                <div style={{ display: 'flex' }}>
                    <h3 style={{ margin: 0 }}>Rules</h3>
                </div>
            </Card>
            {rules.map((rule, idx) => (
                <Accordion
                    key={idx}
                    className="rule-accordion-list-child"
                    title={`Rule ${idx + 1}`}
                >
                    <div style={{ margin: '5px 0' }}>
                        <Label label="API GROUPS">
                            <TagList>
                                {rule.apiGroups &&
                                    rule.apiGroups.map((apiGroup) => (
                                        <Tag key={apiGroup} intent={Intent.NONE} round>
                                            <Text small>{apiGroup === '' ? '""' : apiGroup}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </Label>
                        <Label style={{ marginTop: '0.25em' }} label="RESOURCES">
                            <TagList>
                                {rule.resources &&
                                    rule.resources.map((resource) => (
                                        <Tag key={resource} intent={Intent.NONE} round>
                                            <Text small>{resource}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </Label>
                        <Label style={{ marginTop: '0.25em' }} label="RESOURCE NAMES">
                            <TagList>
                                {rule.resourceNames &&
                                    rule.resourceNames.map((resourceNames) => (
                                        <Tag key={resourceNames} intent={Intent.NONE} round>
                                            <Text small>{resourceNames}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </Label>
                        <Label style={{ marginTop: '0.25em' }} label="NON RESOURCE URLS">
                            <TagList>
                                {rule.nonResourceURLs &&
                                    rule.nonResourceURLs.map((nonResourceURL) => (
                                        <Tag key={nonResourceURL} intent={Intent.NONE} round>
                                            <Text small>{nonResourceURL}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </Label>
                        <Label style={{ marginTop: '0.25em' }} label="VERBS">
                            <TagList>
                                {rule.verbs &&
                                    rule.verbs.map((verbs) => (
                                        <Tag key={verbs} intent={Intent.NONE} round>
                                            <Text small>{verbs}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </Label>
                    </div>
                </Accordion>
            ))}
        </div>
    );
}

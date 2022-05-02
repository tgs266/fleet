/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Tag, Intent } from '@blueprintjs/core';
import { Rule } from '../models/base';
import TagList from './TagList';
import Text from './Text/Text';
import Table from './Table';
import TableBody from './TableBody';
import TableCell from './TableCell';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

export default function RuleTable(props: { rules: Rule[] }) {
    const { rules } = props;

    return (
        <Table>
            <TableHeader>
                <TableCell>API Groups</TableCell>
                <TableCell>Resources</TableCell>
                <TableCell>Resource Names</TableCell>
                <TableCell>Non Resource URLs</TableCell>
                <TableCell>Verbs</TableCell>
            </TableHeader>
            <TableBody>
                {rules.map((rule, idx) => (
                    <TableRow key={idx}>
                        <TableCell>
                            <TagList>
                                {rule.apiGroups &&
                                    rule.apiGroups.map((apiGroup) => (
                                        <Tag key={apiGroup} intent={Intent.NONE} round>
                                            <Text small>{apiGroup === '' ? '""' : apiGroup}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>
                                {rule.resources &&
                                    rule.resources.map((item) => (
                                        <Tag key={item} intent={Intent.NONE} round>
                                            <Text small>{item === '' ? '""' : item}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>
                                {rule.resourceNames &&
                                    rule.resourceNames.map((item) => (
                                        <Tag key={item} intent={Intent.NONE} round>
                                            <Text small>{item === '' ? '""' : item}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>
                                {rule.nonResourceURLs &&
                                    rule.nonResourceURLs.map((item) => (
                                        <Tag key={item} intent={Intent.NONE} round>
                                            <Text small>{item === '' ? '""' : item}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>
                                {rule.verbs &&
                                    rule.verbs.map((item) => (
                                        <Tag key={item} intent={Intent.NONE} round>
                                            <Text small>{item === '' ? '""' : item}</Text>
                                        </Tag>
                                    ))}
                            </TagList>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

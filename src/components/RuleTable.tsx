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

function createTaglist(list: string[]) {
    if (!list) {
        return null;
    }
    return list.map((item) => (
        <Tag key={item} intent={Intent.NONE} round>
            <Text small>{item === '' ? '""' : item}</Text>
        </Tag>
    ));
}

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
                            <TagList>{createTaglist(rule.apiGroups)}</TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>{createTaglist(rule.resources)}</TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>{createTaglist(rule.resourceNames)}</TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>{createTaglist(rule.nonResourceURLs)}</TagList>
                        </TableCell>
                        <TableCell>
                            <TagList>{createTaglist(rule.verbs)}</TagList>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

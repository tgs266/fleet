/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Button, ButtonGroup, Icon, InputGroup, MenuItem, Tag } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import TableRow from './TableRow';
import TableCell from './TableCell';
import Text from './Text/Text';
import { PaginationProps } from './Table';
import { Filter } from '../models/base';
import TagList from './TagList';

const OPERATORS = [
    {
        name: 'in',
        id: 'in',
    },
    {
        name: '==',
        id: 'eq',
    },
    {
        name: '!=',
        id: 'neq',
    },
    {
        name: '>',
        id: 'gt',
    },
    {
        name: '>=',
        id: 'gte',
    },
    {
        name: '<',
        id: 'lt',
    },
    {
        name: '<=',
        id: 'lte',
    },
];

export default function TableBody(props: {
    paginationProps?: PaginationProps;
    style?: any;
    children?: PropTypes.ReactNodeArray;
    filterOptions?: { name: string; id: string }[];
    filters?: Filter[];
    onFilterAdd?: (f: Filter) => void;
    onFilterRemove?: (idx: number) => void;
}) {
    const { children, style } = props;
    const { paginationProps } = props;

    let defaultFilterProp = null;
    if (props.filterOptions) {
        defaultFilterProp = props.filterOptions[0];
    }

    const [selectedFilter, setSelectedFilter] = React.useState(defaultFilterProp);
    // const [operator, setSelectedOperator] = React.useState(OPERATORS[0])

    const ref = React.useRef<HTMLInputElement>();

    const add = () => {
        if (ref.current.value && ref.current.value !== '') {
            props.onFilterAdd({
                property: selectedFilter.id,
                operator: OPERATORS[0].id,
                value: ref.current.value,
            });
            ref.current.value = '';
        }
    };

    return (
        <>
            <tbody style={style}>{children}</tbody>
            {paginationProps && (
                <tfoot>
                    <TableRow>
                        <TableCell colspan={100}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {props.filters && (
                                    <>
                                        <Select
                                            filterable={false}
                                            items={props.filterOptions}
                                            onItemSelect={(item) => setSelectedFilter(item)}
                                            itemRenderer={(item, itemProps) => (
                                                <MenuItem
                                                    active={itemProps.modifiers.active}
                                                    disabled={itemProps.modifiers.disabled}
                                                    key={item.id}
                                                    onClick={itemProps.handleClick}
                                                    text={item.name}
                                                />
                                            )}
                                        >
                                            <Button rightIcon="double-caret-vertical">
                                                {selectedFilter.name}
                                            </Button>
                                        </Select>
                                        <InputGroup
                                            inputRef={ref}
                                            onKeyDown={(k) => {
                                                if (k.key === 'Enter') {
                                                    add();
                                                }
                                            }}
                                        />
                                        <Button onClick={add}>Filter</Button>
                                        <TagList style={{ marginLeft: '1em', marginRight: '1em' }}>
                                            {props.filters.map((f, idx) => (
                                                <Tag key={idx} style={{ height: '25px' }} round>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
                                                        <div>
                                                            {f.property}: {f.value}
                                                        </div>
                                                        <Icon
                                                            icon="small-cross"
                                                            onClick={() =>
                                                                props.onFilterRemove(idx)
                                                            }
                                                        />
                                                    </div>
                                                </Tag>
                                            ))}
                                        </TagList>
                                    </>
                                )}
                                <div style={{ flexGrow: 1 }} />
                                <Text style={{ marginRight: '0.5em' }}>
                                    {paginationProps.page * paginationProps.pageSize + 1} -{' '}
                                    {Math.min(
                                        (paginationProps.page + 1) * paginationProps.pageSize,
                                        paginationProps.total
                                    )}{' '}
                                    of {paginationProps.total}
                                </Text>
                                <ButtonGroup>
                                    <Button
                                        data-testid="prev-page"
                                        icon="chevron-left"
                                        onClick={() =>
                                            paginationProps.onPageChange(paginationProps.page - 1)
                                        }
                                        disabled={paginationProps.page === 0}
                                    />
                                    <Button
                                        data-testid="next-page"
                                        icon="chevron-right"
                                        onClick={() =>
                                            paginationProps.onPageChange(paginationProps.page + 1)
                                        }
                                        disabled={
                                            Math.min(
                                                (paginationProps.page + 1) *
                                                    paginationProps.pageSize,
                                                paginationProps.total
                                            ) >= paginationProps.total
                                        }
                                    />
                                </ButtonGroup>
                            </div>
                        </TableCell>
                    </TableRow>
                </tfoot>
            )}
        </>
    );
}

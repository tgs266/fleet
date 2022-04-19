import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Button, ButtonGroup } from '@blueprintjs/core';
import TableRow from './TableRow';
import TableCell from './TableCell';
import Text from './Text/Text';
import { PaginationProps } from './Table';

export default function TableBody(props: {
    paginationProps?: PaginationProps;
    style?: any;
    children?: PropTypes.ReactNodeArray;
}) {
    const { children, style } = props;
    const { paginationProps } = props;
    return (
        <>
            <tbody style={style}>{children}</tbody>
            {paginationProps && (
                <tfoot>
                    <TableRow>
                        <TableCell colspan={100}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
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
                                        icon="chevron-left"
                                        onClick={() =>
                                            paginationProps.onPageChange(paginationProps.page - 1)
                                        }
                                        disabled={paginationProps.page === 0}
                                    />
                                    <Button
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
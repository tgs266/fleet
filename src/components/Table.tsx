import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

export interface PaginationProps {
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    total: number;
}

export default function Table(props: {
    className?: string;
    style?: React.CSSProperties;
    children: PropTypes.ReactNodeLike;
}) {
    const { children } = props;
    let { style } = props;

    if (!style) {
        style = { width: '100%' };
    } else {
        style = { width: '100%', ...style };
    }
    return (
        <table
            className={`${props.className} bp4-html-table bp4-html-table-condensed bp4-html-table-striped`}
            style={style}
        >
            {children}
        </table>
    );
}

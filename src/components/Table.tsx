import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import Text from './Text/Text';

export interface PaginationProps {
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    total: number;
}

export default function Table(props: {
    className?: string;
    title?: string;
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
        <div>
            {props.title && <Text large>{props.title}</Text>}
            <table
                className={`${props.className} bp4-html-table bp4-html-table-condensed bp4-html-table-striped`}
                style={{ ...style }}
            >
                {children}
            </table>
        </div>
    );
}

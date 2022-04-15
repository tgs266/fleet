/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

export default function TableHeader(props: {
    style?: React.CSSProperties;
    rowStyle?: React.CSSProperties;
    children: PropTypes.ReactNodeLike;
}) {
    const { children, style, rowStyle } = props;
    return (
        <thead style={{ ...style, fontWeight: 'bolder' }}>
            <tr style={rowStyle}>{children}</tr>
        </thead>
    );
}

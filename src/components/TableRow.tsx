import * as React from 'react';
import PropTypes from 'prop-types'; // ES6

export default function TableRow(props: { style?: any; children?: PropTypes.ReactNodeLike }) {
    const { children, style } = props;
    return <tr style={style}>{children}</tr>;
}

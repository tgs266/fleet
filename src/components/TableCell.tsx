import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Alignment } from '@blueprintjs/core';

export default function TableCell(props: {
    colspan?: number;
    alignment?: Alignment;
    style?: React.CSSProperties;
    children?: PropTypes.ReactNodeLike;
}) {
    const { children, alignment, colspan } = props;
    let { style } = props;
    if (!style) {
        style = { display: 'table-cell', verticalAlign: 'middle' };
    } else {
        style = { display: 'table-cell', verticalAlign: 'middle', ...style };
    }

    const innerStyle: React.CSSProperties = {};

    if (alignment) {
        switch (alignment) {
            case Alignment.RIGHT:
                innerStyle.float = 'right';
                break;
            case Alignment.LEFT:
                innerStyle.float = 'left';
                break;
            case Alignment.CENTER:
                style.textAlign = 'center';
                break;
            default:
                break;
        }
    }

    return (
        <td style={style} colSpan={colspan}>
            <div style={innerStyle}>{children}</div>
        </td>
    );
}

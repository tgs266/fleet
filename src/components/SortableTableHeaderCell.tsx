/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Alignment, Icon } from '@blueprintjs/core';

export interface TableSort {
    sortableId: string;
    ascending: boolean;
}

export default function SortableTableHeaderCell(props: {
    sort: TableSort;
    sortableId: string;
    onSortChange?: (sort: TableSort) => void;
    colspan?: number;
    alingment?: Alignment;
    style?: React.CSSProperties;
    children?: PropTypes.ReactNodeLike;
}) {
    const { sort, sortableId, children, alingment, colspan } = props;
    let { style } = props;
    if (!style) {
        style = { display: 'table-cell', verticalAlign: 'middle' };
    } else {
        style = { display: 'table-cell', verticalAlign: 'middle', ...style };
    }

    const innerStyle: React.CSSProperties = {};

    if (alingment) {
        switch (alingment) {
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

    let icon = null;

    const onClick = () => {
        if (sort.sortableId === sortableId) {
            props.onSortChange({
                ...sort,
                ascending: !sort.ascending,
            });
        } else {
            props.onSortChange({
                sortableId,
                ascending: false,
            });
        }
    };

    if (sort.sortableId === sortableId) {
        icon = <Icon icon={sort.ascending ? 'caret-down' : 'caret-up'} />;
    }

    return (
        <td style={style} colSpan={colspan}>
            <div onClick={onClick} className="sortable-header-cell" style={{ ...innerStyle }}>
                {children}
                {icon}
            </div>
        </td>
    );
}

import * as React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Button, ButtonGroup, Card, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';

export default function Toolbar(props: {
    leftElement: PropTypes.ReactNodeLike;
    rightElement?: PropTypes.ReactNodeLike;
    buttons?: JSX.Element[];
    menu?: JSX.Element;
    style?: React.CSSProperties;
}) {
    return (
        <Card style={{ ...props.style, display: 'flex' }}>
            {props.leftElement}
            <div style={{ flexGrow: 1 }} />
            {props.rightElement}
            <ButtonGroup>
                {props.buttons}
                {props.menu && (
                    <Popover2 content={props.menu} position={Position.BOTTOM_LEFT}>
                        <Button icon="more" />
                    </Popover2>
                )}
            </ButtonGroup>
        </Card>
    );
}

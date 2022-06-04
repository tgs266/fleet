import { ContextMenu2 } from '@blueprintjs/popover2';
import { Link as RLink, useNavigate } from 'react-router-dom';
import React from 'react';
import { MenuItem, Menu } from '@blueprintjs/core';

export default function Link(props: {
    style?: React.CSSProperties;
    to: string;
    target?: string;
    children?: React.ReactNode;
}) {
    const nav = useNavigate();
    return (
        <ContextMenu2
            style={{ zIndex: 10000000000000, display: 'inline' }}
            content={
                <Menu>
                    <MenuItem text="Open" onClick={() => nav(props.to)} />
                    <MenuItem
                        text="Open in new tab"
                        onClick={() => {
                            let url = props.to;
                            if (!props.to.startsWith('/#')) {
                                if (props.to.startsWith('/')) {
                                    url = `/#${url}`;
                                } else {
                                    url = `/#/${url}`;
                                }
                            }
                            window.open(url, '_blank');
                        }}
                    />
                </Menu>
            }
        >
            <RLink to={props.to} style={props.style} target={props.target}>
                {props.children}
            </RLink>
        </ContextMenu2>
    );
}

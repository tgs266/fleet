import * as React from 'react';
import { Icon, Position, IconName } from '@blueprintjs/core';
import { useLocation, useNavigate } from 'react-router';
import { Tooltip2 } from '@blueprintjs/popover2';
// import { SidebarTree } from './NavbarTree'

export interface NavButton {
    target: string;
    icon: IconName;
    name: string;
    activeSelector?: (arg: string) => boolean;
}

export default function SideNavButton(props: NavButton) {
    const navigate = useNavigate();
    const loc = useLocation();

    let active = false;
    if (props.activeSelector) {
        active = props.activeSelector(loc.pathname);
    } else {
        active = loc.pathname.startsWith(props.target);
    }

    const inner = (
        <div
            className={`sidebar-icon no-outline ${active ? 'sidebar-active' : ''}`}
            id={props.name}
            onClick={() => {
                navigate(props.target);
            }}
        >
            <Icon size={22} icon={props.icon} />
        </div>
    );

    if (props.name) {
        return (
            <Tooltip2 position={Position.RIGHT} content={props.name} hoverOpenDelay={0}>
                {inner}
            </Tooltip2>
        );
    }

    return inner;
}

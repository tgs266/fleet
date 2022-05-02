import * as React from 'react';
import { Icon, Position, IconName, Menu, MenuItem } from '@blueprintjs/core';
import { useLocation, useNavigate } from 'react-router';
import { Tooltip2, Popover2 } from '@blueprintjs/popover2';

export interface NavButton {
    type: string;
    children?: NavMenuItem[];
    hoverEle?: JSX.Element;
    target?: string;
    icon: IconName;
    id?: string;
    name?: string;
    activeSelector?: (arg: string) => boolean;
}

export interface NavMenuItem {
    target: string;
    icon: IconName;
    id: string;
    name?: string;
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

    if (props.type === 'button') {
        const inner = (
            <div
                className={`sidebar-icon no-outline ${active ? 'sidebar-active' : ''}`}
                id={props.id}
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
    if (props.type === 'menu') {
        const menu = (
            <Menu>
                {props.children.map((c) => (
                    <MenuItem
                        key={c.id}
                        onClick={() => navigate(c.target)}
                        text={c.name}
                        icon={c.icon}
                        id={c.id}
                    />
                ))}
            </Menu>
        );

        const btn = (
            <Popover2 popoverClassName="bp4-dark" content={menu} position={Position.RIGHT}>
                <div
                    className={`sidebar-icon no-outline ${active ? 'sidebar-active' : ''}`}
                    id={props.id}
                >
                    <Icon size={22} icon={props.icon} />
                </div>
            </Popover2>
        );
        return btn;
    }

    return (
        <Tooltip2 content={props.hoverEle} position={Position.RIGHT}>
            <div
                className={`sidebar-icon no-outline ${active ? 'sidebar-active' : ''}`}
                id={props.id}
            >
                <Icon size={22} icon={props.icon} />
            </div>
        </Tooltip2>
    );
}

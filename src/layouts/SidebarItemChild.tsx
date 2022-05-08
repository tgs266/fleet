/* eslint-disable no-restricted-syntax */
import { animated } from '@react-spring/web';
import React from 'react';
import { useLocation, useNavigate } from 'react-router';

export interface SidebarItemChildProps {
    activeRule?: (arg: string) => boolean;
    id: string;
    title?: string;
    target?: string;
}

export default function SidebarItemChild(props: SidebarItemChildProps) {
    const loc = useLocation();
    const nav = useNavigate();

    let active = false;

    if (props.activeRule) {
        active = props.activeRule(loc.pathname);
    } else {
        active = loc.pathname.startsWith(props.target);
    }

    const getClassNames = () => `sidebar-hover sidebar-child ${active ? 'active' : ''}`;

    const handleClick = () => {
        nav(props.target);
    };

    const padding = '5px';

    return (
        <div
            id={props.id}
            data-testid={props.id}
            className={getClassNames()}
            style={{
                paddingLeft: '10px',
                paddingTop: padding,
                paddingBottom: padding,
                display: 'flex',
                alignItems: 'center',
            }}
            onClick={handleClick}
        >
            <animated.div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                {props.title}
                <div style={{ flexGrow: 1 }} />
            </animated.div>
        </div>
    );
}

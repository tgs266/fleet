/* eslint-disable no-restricted-syntax */
import { Icon, IconName, Colors } from '@blueprintjs/core';
import { Tooltip2 } from '@blueprintjs/popover2';
import { animated, SpringValue, useSpring } from '@react-spring/web';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useMeasure } from 'react-use';
import RotatingIcon from '../components/RotatingIcon';
import SidebarItemChild, { SidebarItemChildProps } from './SidebarItemChild';

export interface SidebarMenuItem {
    name: string;
    id: string;
}

export interface SidebarItemProps {
    activeRule?: (arg: string) => boolean;
    id: string;
    items?: SidebarItemChildProps[];
    type: 'button' | 'menu' | 'component';
    icon?: IconName | JSX.Element;
    title?: string;
    opacity?: SpringValue<number>;
    isExpanded?: boolean;
    target?: string;
    children?: React.ReactNode;
    hover?: JSX.Element;
    sideIcon?: IconName;
}

export default function SidebarItem(props: SidebarItemProps) {
    const [open, setOpen] = useState(false);
    const [ref, { height: he }] = useMeasure();
    const loc = useLocation();
    const nav = useNavigate();

    useEffect(() => {
        setOpen(false);
    }, [props.isExpanded]);

    let active = false;

    if (props.activeRule) {
        active = props.activeRule(loc.pathname);
    } else {
        active = loc.pathname.startsWith(props.target);
    }

    const handleClick = () => {
        if (props.type === 'menu') {
            setOpen(!open);
        } else {
            nav(props.target);
        }
    };

    const getClassNames = () => `sidebar-hover ${active ? 'sidebar-parent-active' : ''}`;

    const padding = 'calc(1.5em - 10px)';

    const { height } = useSpring({ height: open ? he : 0 });

    const getNonComponent = () => (
        <>
            <div
                id={props.id}
                data-testid={props.id}
                className={getClassNames()}
                style={{
                    paddingTop: padding,
                    paddingBottom: padding,
                    display: 'flex',
                    alignItems: 'center',
                }}
                onClick={handleClick}
            >
                {props.icon && typeof props.icon === 'string' && (
                    <Icon
                        color={Colors.LIGHT_GRAY5}
                        size={20}
                        icon={props.icon}
                        style={{ marginLeft: padding, marginRight: padding }}
                    />
                )}
                {props.icon && typeof props.icon !== 'string' && (
                    <div
                        style={{
                            height: '20px',
                            width: '20px',
                            marginLeft: padding,
                            marginRight: padding,
                        }}
                    >
                        {props.icon}
                    </div>
                )}
                <animated.div
                    style={{
                        opacity: props.opacity,
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                    }}
                >
                    {props.title}
                    <div style={{ flexGrow: 1 }} />
                    {props.type === 'menu' && (
                        <RotatingIcon
                            style={{ marginRight: '10px' }}
                            initialDegrees={0}
                            rotateDegrees={-90}
                            icon="caret-left"
                            isRotated={open}
                            iconProps={{ color: Colors.LIGHT_GRAY5, size: 20 }}
                        />
                    )}
                    {props.type === 'button' && props.sideIcon && (
                        <Icon
                            style={{ marginRight: '10px' }}
                            color={Colors.LIGHT_GRAY5}
                            size={20}
                            icon={props.sideIcon}
                        />
                    )}
                </animated.div>
            </div>
            {props.type === 'menu' && (
                <animated.div style={{ overflow: 'hidden', height, opacity: props.opacity }}>
                    <div ref={ref}>
                        {props.items.map((item) => (
                            <div
                                className="sidebar-hover sidebar-child"
                                style={{ paddingLeft: '1.5em' }}
                                key={item.id}
                                data-testid={item.id}
                            >
                                <SidebarItemChild {...item} />
                            </div>
                        ))}
                    </div>
                </animated.div>
            )}
        </>
    );

    const getComponent = () => (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                color: Colors.LIGHT_GRAY5,
                paddingTop: padding,
                paddingBottom: padding,
            }}
        >
            {props.icon && (
                <Icon
                    color={Colors.LIGHT_GRAY5}
                    size={20}
                    icon={props.icon}
                    style={{ marginLeft: padding, marginRight: padding }}
                />
            )}
            <animated.div
                style={{
                    opacity: props.opacity,
                    display: 'flex',
                    alignItems: 'center',
                    flexGrow: 1,
                }}
            >
                {props.children}
                <div style={{ flexGrow: 1 }} />
                {props.sideIcon && (
                    <Icon
                        style={{ marginRight: '10px' }}
                        color={Colors.LIGHT_GRAY5}
                        size={20}
                        icon={props.sideIcon}
                    />
                )}
            </animated.div>
        </div>
    );

    const hoverWrap = (inner: React.ReactNode) => {
        if (props.hover) {
            return (
                <div className="sidebar-hover">
                    <Tooltip2 className="block" usePortal={false} content={props.hover}>
                        {inner}
                    </Tooltip2>
                </div>
            );
        }
        return inner;
    };

    return (
        <div style={{ whiteSpace: 'nowrap' }}>
            {(props.type === 'button' || props.type === 'menu') && getNonComponent()}
            {props.type !== 'button' && props.type !== 'menu' && hoverWrap(getComponent())}
        </div>
    );
}

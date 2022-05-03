/* eslint-disable react/no-children-prop */
import { Intent, Tag } from '@blueprintjs/core';
import { AxiosResponse } from 'axios';
import * as React from 'react';
import Auth from '../services/auth.service';
import SideNavButton, { NavButton, NavMenuItem } from './SideNavButton';

const navBtns: NavButton[] = [
    {
        type: 'button',
        target: '/',
        id: 'Home',
        icon: 'home',
        activeSelector: (pathname: string) =>
            pathname.startsWith('/') && pathname.endsWith('/') && pathname.length === 1,
    },
    {
        type: 'button',
        target: '/namespaces',
        icon: 'projects',
        name: 'Namespaces',
        id: 'Namespaces',
    },
    {
        type: 'button',
        target: '/nodes',
        icon: 'control',
        name: 'Nodes',
        id: 'Nodes',
    },
    {
        type: 'button',
        target: '/deployments',
        icon: 'applications',
        name: 'Deployments',
        id: 'Deployments',
    },
    {
        type: 'button',
        target: '/pods',
        icon: 'group-objects',
        name: 'Pods',
        id: 'Pods',
    },
    {
        type: 'button',
        target: '/services',
        icon: 'globe-network',
        name: 'Services',
        id: 'Services',
    },
];

function handleAdd(allowed: boolean, newItem: NavMenuItem, menuItems: NavMenuItem[]) {
    if (allowed) {
        menuItems.push(newItem);
    }
}

export default function SideNavigation() {
    const [buttons, setButtons] = React.useState(navBtns);
    const [usingAuth, setUsingAuth] = React.useState(false);

    React.useEffect(() => {
        Auth.using().then((r) => {
            setUsingAuth(r.data.usingAuth);
        });
    }, []);

    React.useEffect(() => {
        const promiseArray: Promise<
            AxiosResponse<
                {
                    allowed: boolean;
                },
                any
            >
        >[] = [];
        promiseArray.push(Auth.canI('serviceaccounts', 'list'));
        promiseArray.push(Auth.canI('roles', 'list'));
        promiseArray.push(Auth.canI('rolebindings', 'list'));

        const menuItems: NavMenuItem[] = [];

        Promise.allSettled(promiseArray).then((response) => {
            if (response[0].status === 'fulfilled') {
                handleAdd(
                    response[0].value.data.allowed,
                    {
                        target: '/serviceaccounts',
                        icon: 'cog',
                        name: 'Service Accounts',
                        id: 'ServiceAccounts',
                    },
                    menuItems
                );
            }
            if (response[1].status === 'fulfilled') {
                // roles
                handleAdd(
                    response[1].value.data.allowed,
                    {
                        target: '/roles',
                        icon: 'inherited-group',
                        name: 'Roles',
                        id: 'Roles',
                    },
                    menuItems
                );
            }
            if (response[2].status === 'fulfilled') {
                // role bindings
                handleAdd(
                    response[2].value.data.allowed,
                    {
                        target: '/rolebindings',
                        icon: 'inner-join',
                        name: 'Role Bindings',
                        id: 'RoleBindings',
                    },
                    menuItems
                );
            }
            if (menuItems.length !== 0) {
                setButtons([
                    ...buttons,
                    {
                        type: 'menu',
                        icon: 'people',
                        children: menuItems,
                    },
                ]);
            }
        });
    }, []);

    return (
        <div style={{ WebkitUserSelect: 'none' }}>
            <div className="sidebar">
                {buttons.map((btn) => (
                    <SideNavButton key={btn.name} {...btn} />
                ))}
                <SideNavButton
                    key="storage"
                    icon="database"
                    type="menu"
                    children={[
                        {
                            target: '/secrets',
                            icon: 'key',
                            name: 'Secrets',
                            id: 'secrets',
                        },
                    ]}
                />
                <div style={{ flexGrow: 1 }} />

                <SideNavButton key="search" icon="search" type="hover" hoverEle={<div />} />
                <SideNavButton
                    key="user"
                    icon="user"
                    type="hover"
                    hoverEle={
                        <div>
                            Authentication:
                            <Tag
                                style={{ marginLeft: '0.5em' }}
                                intent={usingAuth ? Intent.SUCCESS : Intent.DANGER}
                            >
                                {usingAuth ? 'ENABLED' : 'DISABLED'}
                            </Tag>
                        </div>
                    }
                />
            </div>
        </div>
    );
}

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
                if (response[0].value.data.allowed) {
                    menuItems.push({
                        target: '/serviceaccounts',
                        icon: 'cog',
                        name: 'Service Accounts',
                        id: 'ServiceAccounts',
                    });
                }
            }
            if (response[1].status === 'fulfilled') {
                // roles
                if (response[1].value.data.allowed) {
                    menuItems.push({
                        target: '/roles',
                        icon: 'inherited-group',
                        name: 'Roles',
                        id: 'Roles',
                    });
                }
            }
            if (response[2].status === 'fulfilled') {
                // role bindings
                if (response[2].value.data.allowed) {
                    menuItems.push({
                        target: '/rolebindings',
                        icon: 'inner-join',
                        name: 'Role Bindings',
                        id: 'RoleBindings',
                    });
                }
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
                <div style={{ flexGrow: 1 }} />
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

/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import { useSpring, animated, config } from '@react-spring/web';
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import Auth from '../services/auth.service';
import Electron from '../services/electron.service';

const SIDEBAR_ITEM_PROPS: SidebarItemProps[] = [
    {
        id: 'home',
        icon: 'home',
        type: 'button',
        title: 'Home',
        target: '/',
        activeRule: (loc) => loc.startsWith('/') && loc.endsWith('/') && loc.length === 1,
    },
    {
        id: 'fleet',
        icon: 'graph',
        type: 'button',
        title: 'Fleet',
        target: '/fleet',
    },
    {
        id: 'nodes',
        icon: 'diagram-tree',
        type: 'button',
        title: 'Nodes',
        target: '/nodes',
    },
    {
        id: 'namespaces',
        icon: 'projects',
        type: 'button',
        title: 'Namespaces',
        target: '/namespaces',
    },
    {
        id: 'workloads',
        icon: 'applications',
        type: 'menu',
        title: 'Workloads',
        activeRule: (loc) => loc.startsWith('/deployments') || loc.startsWith('/pods'),
        items: [
            {
                title: 'Deployments',
                id: 'deployments',
                target: '/deployments',
            },
            {
                title: 'Pods',
                id: 'pods',
                target: '/pods',
            },
        ],
    },
    {
        id: 'networking',
        icon: 'globe-network',
        type: 'menu',
        title: 'Networking',
        activeRule: (loc) => loc.startsWith('/services'),
        items: [
            {
                title: 'Services',
                id: 'services',
                target: '/services',
            },
        ],
    },
    {
        id: 'storage',
        icon: 'database',
        type: 'menu',
        title: 'Storage',
        activeRule: (loc) => loc.startsWith('/secrets'),
        items: [
            {
                title: 'Secrets',
                id: 'secrets',
                target: '/secrets',
            },
        ],
    },
    {
        id: 'access-control',
        icon: 'shield',
        type: 'menu',
        title: 'Access Control',
        activeRule: (loc) =>
            loc.startsWith('/roles') ||
            loc.startsWith('/rolebindings') ||
            loc.startsWith('/serviceaccounts'),
        items: [
            {
                title: 'Service Accounts',
                id: 'service-accounts',
                target: '/serviceaccounts',
            },
            {
                title: 'Role Bindings',
                id: 'role-bindings',
                target: '/rolebindings',
            },
            {
                title: 'Roles',
                id: 'roles',
                target: '/roles',
            },
        ],
    },
];

export default function Sidebar() {
    const [styles, api] = useSpring(() => ({
        width: '3em',
        treeOpacity: 0,
        config: {
            ...config.default,
        },
    }));
    const [open, setOpen] = useState(false);
    const [usingAuth, setUsingAuth] = React.useState(false);
    const [clusterName, setClusterName] = React.useState('');

    React.useEffect(() => {
        Auth.using().then((r) => {
            setUsingAuth(r.data.usingAuth);
        });
        if (Electron.isElectron) {
            Electron.getCurrentCluster().then((r) => {
                setClusterName(r.data);
            });
        }
    }, []);
    api.start({ width: open ? '15em' : '3em', treeOpacity: open ? 1 : 0 });
    return (
        <div style={{ position: 'fixed', zIndex: 1000000 }}>
            <animated.div
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="sidebar"
                style={{
                    width: styles.width,
                    overflow: 'hidden',
                    position: 'absolute',
                    zIndex: 1000,
                }}
            >
                {Electron.isElectron && (
                    <SidebarItem
                        id="cluster"
                        type="button"
                        icon="desktop"
                        opacity={styles.treeOpacity}
                        isExpanded={open}
                        title={clusterName}
                        sideIcon="exchange"
                    />
                )}
                {SIDEBAR_ITEM_PROPS.map((sp) => (
                    <SidebarItem
                        key={sp.id}
                        {...sp}
                        opacity={styles.treeOpacity}
                        isExpanded={open}
                    />
                ))}
                <div style={{ flexGrow: 1 }} />
                <SidebarItem
                    sideIcon="info-sign"
                    id="component"
                    type="component"
                    icon="person"
                    opacity={styles.treeOpacity}
                    isExpanded={open}
                    hover={
                        <div>
                            <div>
                                Authentication:
                                <Tag
                                    style={{ marginLeft: '0.5em' }}
                                    intent={usingAuth ? Intent.SUCCESS : Intent.DANGER}
                                >
                                    {usingAuth ? 'ENABLED' : 'DISABLED'}
                                </Tag>
                            </div>
                            <div style={{ marginTop: '0.25em' }}>
                                Username: {localStorage.getItem('username')}
                            </div>
                        </div>
                    }
                >
                    User Details
                </SidebarItem>
            </animated.div>
        </div>
    );
}

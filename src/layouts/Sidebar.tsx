/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import { useSpring, animated, config } from '@react-spring/web';
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import Electron from '../services/electron.service';
import { useAuthContext } from '../contexts/AuthContext';
import FleetLogo from '../components/FleetLogo';
import HelmLogo from '../components/HelmLogo';

const SIDEBAR_ITEM_PROPS: SidebarItemProps[] = [
    {
        id: 'home',
        icon: <FleetLogo />,
        // icon: 'home',
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
            {
                title: 'Replica Sets',
                id: 'replicasets',
                target: '/replicasets',
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
    {
        id: 'helm',
        icon: <HelmLogo />,
        type: 'menu',
        title: 'Helm',
        activeRule: (loc) => loc.startsWith('/helm'),
        items: [
            {
                title: 'Charts',
                id: 'charts',
                target: '/helm/charts',
            },
            {
                title: 'Releases',
                id: 'releases',
                target: '/helm/releases',
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
    const [authCtx] = useAuthContext();

    let userName = 'No username found';
    if (authCtx && authCtx.username) {
        userName = authCtx.username;
    }

    let useAuth = null;
    if (authCtx) {
        useAuth = authCtx.useAuth;
    }

    let clusterName = null;
    if (authCtx && authCtx.cluster) {
        clusterName = authCtx.cluster.name;
    }

    let authIntent = null;
    let authString = 'UNKNOWN';
    if (useAuth === false) {
        authIntent = Intent.DANGER;
        authString = 'DISABLED';
    } else if (useAuth === true) {
        authIntent = Intent.SUCCESS;
        authString = 'ENABLED';
    } else {
        authIntent = Intent.NONE;
    }

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
                        target="/clusters"
                        opacity={styles.treeOpacity}
                        isExpanded={open}
                        title={clusterName}
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
                                <Tag style={{ marginLeft: '0.5em' }} intent={authIntent}>
                                    {authString}
                                </Tag>
                            </div>
                            <div style={{ marginTop: '0.25em' }}>Username: {userName}</div>
                        </div>
                    }
                >
                    User Details
                </SidebarItem>
            </animated.div>
        </div>
    );
}

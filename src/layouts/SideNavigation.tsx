import * as React from 'react';
import SideNavButton, { NavButton } from './SideNavButton';

export default function SideNavigation() {
    const navBtns: NavButton[] = [
        {
            target: '/',
            id: 'Home',
            icon: 'home',
            activeSelector: (pathname: string) =>
                pathname.startsWith('/') && pathname.endsWith('/') && pathname.length === 1,
        },
        {
            target: '/namespaces',
            icon: 'projects',
            name: 'Namespaces',
            id: 'Namespaces',
        },
        {
            target: '/nodes',
            icon: 'control',
            name: 'Nodes',
            id: 'Nodes',
        },
        {
            target: '/deployments',
            icon: 'applications',
            name: 'Deployments',
            id: 'Deployments',
        },
        {
            target: '/pods',
            icon: 'group-objects',
            name: 'Pods',
            id: 'Pods',
        },
        {
            target: '/services',
            icon: 'globe-network',
            name: 'Services',
            id: 'Services',
        },
    ];
    return (
        <div style={{ WebkitUserSelect: 'none' }}>
            <div className="sidebar">
                {navBtns.map((btn) => (
                    <SideNavButton key={btn.name} {...btn} />
                ))}
            </div>
        </div>
    );
}

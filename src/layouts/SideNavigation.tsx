/* eslint-disable @typescript-eslint/indent */
import * as React from 'react';
import SideNavButton, { NavButton } from './SideNavButton';

export default function SideNavigation() {
    const navBtns: NavButton[] = [
        {
            target: '/',
            icon: 'home',
            name: null,
            activeSelector: (pathname: string) =>
                pathname.startsWith('/') && pathname.endsWith('/') && pathname.length === 1,
        },
        {
            target: '/namespaces',
            icon: 'projects',
            name: 'Namespaces',
        },
        {
            target: '/nodes',
            icon: 'control',
            name: 'Nodes',
        },
        {
            target: '/deployments',
            icon: 'applications',
            name: 'Deployments',
        },
        {
            target: '/pods',
            icon: 'group-objects',
            name: 'Pods',
        },
        {
            target: '/services',
            icon: 'globe-network',
            name: 'Services',
        },
    ];
    return (
        <div style={{ WebkitUserSelect: 'none' }}>
            <div className="sidebar">
                {navBtns.map((btn) => (
                    <SideNavButton {...btn} />
                ))}
            </div>
        </div>
    );
}

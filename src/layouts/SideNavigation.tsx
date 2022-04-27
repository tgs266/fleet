import * as React from 'react';
import Auth from '../services/auth.service';
import SideNavButton, { NavButton } from './SideNavButton';

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

export default function SideNavigation() {
    const [buttons, setButtons] = React.useState(navBtns);

    React.useEffect(() => {
        Auth.canI('serviceaccounts', 'list').then((r) => {
            if (r.data.allowed) {
                setButtons([
                    ...buttons,
                    {
                        target: '/serviceaccounts',
                        icon: 'people',
                        name: 'Service Accounts',
                        id: 'ServiceAccounts',
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
            </div>
        </div>
    );
}

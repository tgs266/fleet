import * as React from 'react';
import { Outlet } from 'react-router';
import Navigation, { NavContextProvider } from './Navigation';
import SideNavigation from './SideNavigation';

function Layout() {
    return (
        <div className="fleet fleet-blueprint-theme">
            <div style={{ display: 'flex', width: '100%' }} id="main-container">
                <SideNavigation />
                <NavContextProvider>
                    <div style={{ width: 'calc(100% - 4em)', flexGrow: 1 }}>
                        <Navigation />
                        <Outlet />
                    </div>
                </NavContextProvider>
            </div>
        </div>
    );
}

export default Layout;

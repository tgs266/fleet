import * as React from 'react';
import { Outlet, useLocation } from 'react-router';
import Auth from '../services/auth.service';
import Navigation, { NavContextProvider } from './Navigation';
import Sidebar from './Sidebar';
// import SideNavigation from './SideNavigation';

function Layout() {
    const location = useLocation();

    React.useEffect(() => {
        Auth.refresh();
    }, [location]);
    return (
        <div className="fleet fleet-blueprint-theme">
            <div style={{ display: 'flex', width: '100%' }} id="main-container">
                <Sidebar />
                <NavContextProvider>
                    <div style={{ flexGrow: 1 }}>
                        <Navigation />
                        <Outlet />
                    </div>
                </NavContextProvider>
            </div>
        </div>
    );
}

export default Layout;

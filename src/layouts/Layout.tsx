import * as React from 'react';
import { Outlet, useLocation } from 'react-router';
import { ClusterContextProvider } from '../contexts/ClusterContext';
import Auth from '../services/auth.service';
import Navigation, { NavContextProvider } from './Navigation';
import Sidebar from './Sidebar';

function Layout() {
    const location = useLocation();

    React.useEffect(() => {
        Auth.refresh();
    }, [location]);
    return (
        <div className="fleet fleet-blueprint-theme">
            <div style={{ display: 'flex', width: '100%' }} id="main-container">
                <ClusterContextProvider>
                    <div style={{ flexBasis: '3em' }}>
                        <Sidebar />
                    </div>
                    <NavContextProvider>
                        <div style={{ flexGrow: 1 }}>
                            <Navigation />
                            <Outlet />
                        </div>
                    </NavContextProvider>
                </ClusterContextProvider>
            </div>
        </div>
    );
}

export default Layout;

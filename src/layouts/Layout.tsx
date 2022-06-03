import * as React from 'react';
import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { AuthContextProvider } from '../contexts/AuthContext';
import Auth from '../services/auth.service';
import WS from '../services/websocket.service';
import Navigation, { NavContextProvider } from './Navigation';
import Sidebar from './Sidebar';

function Layout() {
    const location = useLocation();

    const [timeout, setTimeoutNJS] = useState(null);

    React.useEffect(() => {
        Auth.refresh();
        if (timeout) {
            clearTimeout(timeout);
        }
        const x = setTimeout(() => {
            WS.closeAll();
        }, 15 * 1000 * 60);
        setTimeoutNJS(x);

        return () => {
            clearTimeout(timeout);
            WS.closeAll();
        };
    }, [location]);

    return (
        <div className="fleet fleet-blueprint-theme">
            <div style={{ display: 'flex', width: '100%' }} id="main-container">
                <AuthContextProvider>
                    <div style={{ flexBasis: '3em', flexShrink: 0 }}>
                        <Sidebar />
                    </div>
                    <NavContextProvider>
                        <div style={{ flexGrow: 1 }}>
                            <Navigation />
                            <Outlet />
                        </div>
                    </NavContextProvider>
                </AuthContextProvider>
            </div>
        </div>
    );
}

export default Layout;

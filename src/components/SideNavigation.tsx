import * as React from 'react';
import { Icon } from '@blueprintjs/core';
import { useNavigate } from 'react-router';
// import { SidebarTree } from './NavbarTree'

export default function SideNavigation() {
    const navigate = useNavigate();
    return (
        <div style={{ WebkitUserSelect: 'none' }}>
            <div className="sidebar">
                <div
                    className="sidebar-icon"
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    <Icon size={22} icon="home" />
                </div>
            </div>
        </div>
    );
}

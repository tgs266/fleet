import React from 'react';
import './App.css';
import './styles/neon.less';
import SideNavigation from './components/SideNavigation';

function App() {
    return (
        <div className="neon neon-blueprint-theme">
            <div style={{ display: 'flex', width: '100%' }} id="main-container">
                <SideNavigation />
                <div style={{ width: 'calc(100% - 4em)', flexGrow: 1 }}>
                    <p>Hi</p>
                </div>
            </div>
        </div>
    );
}

export default App;

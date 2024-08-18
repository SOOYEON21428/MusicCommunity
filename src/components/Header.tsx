import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="header-content">
                <nav className="nav">
                    <a href="#trend">Trend Chart</a>
                    <a href="#join">Join</a>
                </nav>
            </div>
        </header>
    );
}

export default Header;

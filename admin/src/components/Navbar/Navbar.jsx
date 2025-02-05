import React from 'react';
import './Navbar.scss';
import { assets } from '../../assets/assets';

const Navbar = () => {
    return (
        <div className='navbar'>
            <div className="navbar-content">
                <div className="left-section">
                    <img className='logo' src={assets.logo} alt="Admin Logo" />
                    <h1 className="title">Admin Panel</h1>
                </div>
                <div className="right-section">
                    <div className="search-bar">
                        <input type="text" placeholder="Type here to search..." />
                    </div>
                    <div className="profile">
                        <img src={assets.profile} alt="Profile" />
                        <div className="profile-info">
                            <span className="name">Admin</span>
                            <span className="role">Super Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
import React, { useState } from 'react';
import './Sidebar.scss';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={`sidebar ${isOpen ? 'open' : 'collapsed'}`}>
            <div className="sidebar-header">
                <h2>Admin</h2>
                <button
                    className="toggle-btn"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>

            <div className="sidebar-menu">
                <NavLink to="/add" className="menu-item" activeClassName="active">
                    <img src={assets.add_icon} alt="Add Items" />
                    <span>Add Items</span>
                </NavLink>

                <NavLink to="/list" className="menu-item" activeClassName="active">
                    <img src={assets.order_icon} alt="List Items" />
                    <span>List Items</span>
                </NavLink>

                <NavLink to="/orders" className="menu-item" activeClassName="active">
                    <img src={assets.order_icon} alt="Orders" />
                    <span>Orders</span>
                </NavLink>
            </div>
        </div>
    );
};

export default Sidebar;
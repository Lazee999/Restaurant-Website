import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Navbar.scss';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("Home");
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const path = location.pathname;
        if (path === '/') setMenu('Home');
        else if (path === '/cart') setMenu('Cart');

    }, [location]);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.navbar-profile')) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        setShowProfileDropdown(false);
        navigate('/');
    };

    const handleMenuClick = (menuItem) => {
        setMenu(menuItem);
        setShowMobileMenu(false);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        handleMenuClick(sectionId);
    };

    return (
        <div className="navbar">
            <Link to="/" onClick={() => handleMenuClick("Home")}>
                <img src={assets.logo} alt="Logo" className="logo" />
            </Link>

            {/* Mobile menu button */}
            <div
                className="mobile-menu-button"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
                <span></span>
                <span></span>
                <span></span>
            </div>

            <ul className={`navbar-menu ${showMobileMenu ? 'show' : ''}`}>
                <Link
                    to="/"
                    onClick={() => handleMenuClick("home")}
                    className={menu === "Home" ? "active" : ""}
                >
                    Home
                </Link>
                <li
                    onClick={() => scrollToSection("explore-menu")}
                    className={menu === "Menu" ? "active" : ""}
                >
                    Menu
                </li>
                <li
                    onClick={() => scrollToSection("healthy")}
                    className={menu === "Healthy" ? "active" : ""}
                >
                    Healthy
                </li>
                <li
                    onClick={() => scrollToSection("footer")}
                    className={menu === "Contact us" ? "active" : ""}
                >
                    Contact us
                </li>
            </ul>

            <div className="navbar-right">
                <div className="search-container">
                    <img src={assets.search_icon} alt="Search Icon" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                    />
                </div>

                <div className="navbar-cart-icon">
                    <Link to="/cart" onClick={() => handleMenuClick("Cart")}>
                        <img src={assets.basket_icon} alt="Cart Icon" />
                        {getTotalCartAmount() > 0 && (
                            <div className="cart-count">{Object.keys(getTotalCartAmount()).length}</div>
                        )}
                    </Link>
                </div>

                {!token ? (
                    <button
                        className="signin-button"
                        onClick={() => setShowLogin(true)}
                    >
                        Sign in
                    </button>
                ) : (
                    <div className="navbar-profile">
                        <img
                            src={assets.profile_icon}
                            alt="Profile"
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        />
                        {showProfileDropdown && (
                            <ul className="profile-dropdown">
                                <li onClick={() => navigate("/myorders")}>
                                    <img src={assets.bag_icon} alt="Orders" />
                                    <p>Orders</p>
                                </li>
                                <hr />
                                <li onClick={logout}>
                                    <img src={assets.logout_icon} alt="Logout" />
                                    <p>Logout</p>
                                </li>
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;








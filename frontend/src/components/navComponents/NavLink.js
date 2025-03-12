import React from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import './NavLink.scss';

const NavLink = ({ to, icon, iconActive = icon }) => {
    return (
        <RouterNavLink 
            to={to} 
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
        >
            {({ isActive }) => isActive ? iconActive : icon}
        </RouterNavLink>
    );
};

export default NavLink;

import React from 'react';
import NavLink from './NavLink';
import { ModeCommentOutlined } from '@mui/icons-material';
import { FormatListBulletedOutlined } from '@mui/icons-material';
import { PersonOutlined } from '@mui/icons-material';
import './Nav.scss';

const Nav = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-list">
                <NavLink to="/chat" icon={<ModeCommentOutlined />}  />
                <NavLink to="/expenses" icon={<FormatListBulletedOutlined />} />
                <NavLink to="/account" icon={<PersonOutlined />} />
            </div>
        </nav>
    );
};

export default Nav;

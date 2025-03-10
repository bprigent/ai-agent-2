import React from 'react';
import NavLink from './NavLink';
import { ModeCommentOutlined } from '@mui/icons-material';
import { ModeCommentRounded } from '@mui/icons-material';
import { FormatListBulletedOutlined } from '@mui/icons-material';
import { FormatListBulletedRounded } from '@mui/icons-material';
import { PersonOutlined } from '@mui/icons-material';
import { PersonRounded } from '@mui/icons-material';
import './Nav.scss';

const Nav = () => {
    return (
        <nav className="sidebar">
            <div className="sidebar-list">
                <NavLink to="/chat" icon={<ModeCommentOutlined />} iconActive={<ModeCommentRounded />}  />
                <NavLink to="/expenses" icon={<FormatListBulletedOutlined />} iconActive={<FormatListBulletedRounded />} />
                <NavLink to="/account" icon={<PersonOutlined />} iconActive={<PersonRounded />} />
            </div>
        </nav>
    );
};

export default Nav;

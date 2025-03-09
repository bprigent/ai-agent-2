import React from 'react';
import PageHeader from './PageHeader';
import './MainPageWrap.scss';
import AnimatedBackground from './AnimatedBackground';
const MainPageWrap = ({ title, children }) => {
    return (
        <div className="main_page">
            <PageHeader title={title} />
            <div className="main_page-content">
                <AnimatedBackground>
                    {children}
                </AnimatedBackground>
            </div>
        </div>
    );
};

export default MainPageWrap;
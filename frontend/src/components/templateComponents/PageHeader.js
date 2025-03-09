import React from 'react';
import { Box } from '@mui/material';
import './PageHeader.scss';

const PageHeader = ({ title }) => {
    return (
        <Box className="page_header">
            <h1 className="page_header-title">{title}</h1>
        </Box>
    );
};

export default PageHeader;

import React from 'react';
import { Box, Typography } from '@mui/material';
import MainPageWrap from '../components/templateComponents/MainPageWrap';

const Expenses = () => {
    return (
        <MainPageWrap title="Expenses">
            <Box sx={{
                padding: '20px',
            }}>
                <Typography variant="h4">this is expenses page</Typography>
            </Box>
        </MainPageWrap>
    );
};

export default Expenses;

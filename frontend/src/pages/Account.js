import React from 'react';
import { Box, Typography } from '@mui/material';
import MainPageWrap from '../components/templateComponents/MainPageWrap';


const Account = () => {
    return (
        <MainPageWrap title="Account">
            <Box sx={{
                padding: '20px',
            }}>
                <Typography variant="h4">this is account page</Typography>
            </Box>
        </MainPageWrap>
    );
};

export default Account;
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Home</h1>
            <Button 
                        variant="contained" 
                        color="primary"
                        onClick={() => navigate('/chat')}
                        sx={{ mr: 2 }}
                    >
                        Go to Chat
                    </Button>
        </div>
    );
};

export default Home;
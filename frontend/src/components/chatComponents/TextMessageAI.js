import React from 'react';
import './TextMessageAI.scss';
import { Box } from '@mui/material';
import { getTimeAgo } from '../../helperfunctions/getTimeAgo';


export default function TextMessageAI({ message }) {
    return (
        <Box className="messageAI-parent_wrapper">
            <span className="messageAI-text">
                {message.content.text}
            </span>
            <span className="messageAI-date">
                Sent {getTimeAgo(message.date)}
            </span>
        </Box>
    );
}


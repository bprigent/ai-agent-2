import React from 'react';
import './TextMessageUser.scss';
import { Box } from '@mui/material';
import { getTimeAgo } from '../../helperfunctions/getTimeAgo';



export default function TextMessageUser({message}) {
    return (
    <Box className="message_user-parent_wrapper">
        <span className="message_user-text">
            {message.content.text}
        </span>
        <span className="message_user-date">
            Sent {getTimeAgo(message.date)}
        </span>
    </Box>
    );
}

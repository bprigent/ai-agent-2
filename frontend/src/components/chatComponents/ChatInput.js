import React, { useState, useRef } from 'react';
import './ChatInput.scss';
import { ButtonMediumPrimary } from '../Buttons';
import { ArrowForward, SubdirectoryArrowLeftRounded } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../store/messageSlice';
import { createHash } from '../../helperfunctions/createHash';

export default function ChatInput() {

    const dispatch = useDispatch();
    
    const [message, setMessage] = useState('');
    const [wordsUsed, setWordsUsed] = useState(0);
    const inputRef = useRef(null); // Ref for the input field

    const handleMessageChange = (e) => {
        const content = e.currentTarget.textContent;
        setMessage(content);
        // Count words only if there's non-whitespace content
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        setWordsUsed(words);
    }

    const handleMessageSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return; // Prevent submitting empty messages
        // Create timestamp
        const now = new Date().toISOString();
        // Create SHA hash from date and content
        const hash = createHash([now, message]);
        // Format the message
        const formattedMessage = {
            id: hash,
            date: now,
            sender: 'user',
            type: 'text',
            content: {
                text: message.trim(),
            }
        };
        // Dispatch the message to Redux store
        dispatch(addMessage(formattedMessage));
        
        // Clear input
        if (inputRef.current) {
            inputRef.current.textContent = '';
            setMessage('');
            setWordsUsed(0);
        }
    }

    const handleMessageKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleMessageSubmit(e);
        }
    }   

    const isMessageEmpty = !message.trim();

    return (
        <form className="chat_form" onSubmit={handleMessageSubmit}>
            <div 
                ref={inputRef}
                className="chat_form-input" 
                contentEditable={true} 
                role="textbox"
                data-placeholder='Ask about your financials...'
                onChange={handleMessageChange}
                onInput={handleMessageChange}
                onKeyDown={handleMessageKeyDown}
            />
            <div className="chat_form-button_container">
                <span className="chat_form-words_used">{wordsUsed} words used</span>
                <div className="chat_form-button_container-CTA_wrapper">
                    <span className="chat_form-words_used">Press enter</span>
                    <div className="chat_form-button_container-arrow">
                        <SubdirectoryArrowLeftRounded/>
                    </div>
                    <ButtonMediumPrimary 
                        label="Send" 
                        type="submit"
                        icon={<ArrowForward />}
                        disabled={isMessageEmpty}
                    />
                </div>
            </div>
        </form>
    );
}
import React from 'react';
import MainPageWrap from '../components/templateComponents/MainPageWrap';
import './Chat.scss';
import ChatInput from '../components/chatComponents/ChatInput';
import ChatList from '../components/chatComponents/ChatList';

const Chat = () => {


    return (
        <MainPageWrap title="Chat">
            <div className="chat_page">
                <ChatList />
                <ChatInput />
            </div>
        </MainPageWrap>
    );
};  

export default Chat;

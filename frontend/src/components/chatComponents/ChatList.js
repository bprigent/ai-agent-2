import React from 'react';
import { useSelector } from 'react-redux';
import TextMessageUser from './TextMessageUser';
import TextMessageAI from './TextMessageAI';
import NumberMessageAI from './NumberMessageAI';
import TableMessageAI from './TableMessageAI';
import PieChartMessageAI from './PieChartMessageAI';
import './ChatList.scss';


const ChatList = () => {
    // get messages from the store
    const messagesObjectList = useSelector((state) => state.messages.messages);

    // check if the message list is empty
    const emptyMessageList = messagesObjectList.length === 0;

    // if the message list is empty, show a message
    if (emptyMessageList) {
        return (
            <div className="chat_list-parent_w">
                <div className="chat_list-empty_w">
                    <h2>Hey there Benjamin,</h2>
                    <p>How can I help you today?</p>
                </div>
            </div>
        );
    }

    // if the message list is not empty, show the messagess
    return (
        <div className="chat_list-parent_w">
            {messagesObjectList.map(messageObj => 
                messageObj.sender === 'user' ? (
                    <TextMessageUser key={messageObj.id} message={messageObj} />
                ) : 
                
                (messageObj.sender === 'ai' && messageObj.type === 'text') ? (
                    <TextMessageAI key={messageObj.id} message={messageObj} />
                ) : 
                
                (messageObj.sender === 'ai' && messageObj.type === 'number') ? (
                    <NumberMessageAI key={messageObj.id} message={messageObj} />
                ) : 
                
                (messageObj.sender === 'ai' && messageObj.type === 'table') ? (
                    <TableMessageAI key={messageObj.id} message={messageObj} />
                ) : 
                
                (messageObj.sender === 'ai' && messageObj.type === 'pie_chart') ? (
                    <PieChartMessageAI key={messageObj.id} message={messageObj} />
                ) : null
            )}
        </div>
    );
}

export default ChatList;
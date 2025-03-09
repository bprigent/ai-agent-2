import React from 'react';
import { useSelector } from 'react-redux';
import TextMessageUser from './TextMessageUser';
import TextMessageAI from './TextMessageAI';
import NumberMessageAI from './NumberMessageAI';
import TableMessageAI from './TableMessageAI';
import PieChartMessageAI from './PieChartMessageAI';
import './ChatList.scss';


const ChatList = () => {

    const messagesObjectList = useSelector((state) => state.messages.messages);

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
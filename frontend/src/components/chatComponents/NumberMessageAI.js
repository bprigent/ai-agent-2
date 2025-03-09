import React from 'react';
import './NumberMessageAI.scss';
import { getTimeAgo } from '../../helperfunctions/getTimeAgo';
import { formatNumberAsCurrency } from '../../helperfunctions/formatNumberAsCurrency';

export default function NumberMessageAI({ message }) {
    return (
        <div className="number_msg-parent_w">
            <div className="number_msg-child_w">

                <div className="number_msg-value_w">
                    <span className="number_msg-value_w-value">
                        {formatNumberAsCurrency(message.content.value)}
                    </span>
                    <span className="number_msg-value_w-metric">
                        {message.content.metric}
                    </span>
                </div>
                
                <span className="number_msg-label">
                    {message.content.label}
                </span>

            </div>

            <span className="number_msg-date">
                Sent {getTimeAgo(message.date)}
            </span>

        </div>
    );
}

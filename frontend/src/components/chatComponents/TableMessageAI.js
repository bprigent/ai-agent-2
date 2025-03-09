import React from 'react';
import './TableMessageAI.scss';
import { getTimeAgo } from '../../helperfunctions/getTimeAgo';

export default function TableMessageAI({ message }) {
    return (
        <div className="table_msg-parent_w">
            <div className="table_msg-child_w">
                <table className="table_msg-table">
                    <thead>
                        <tr>
                            {message.content.headerList.map((header, index) => (
                                <th key={index} className="table_msg-table-header">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {message.content.rowList.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="table_msg-table-cell">
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <span className="table_msg-date">
                Sent {getTimeAgo(message.date)}
            </span>
        </div>
    );
}

import React from 'react';
import './TableRow.scss';

function CustomTableRow({ columns, data }) {
    return (
        <div className="table_row-parent_w">
            {columns.map((column) => (
                <div key={column.id} className="table_row-cell_w">
                    {column.render(data)}
                </div>
            ))}
        </div>
    );
}

export default CustomTableRow; 
import React from 'react';
import './TableHeader.scss';

function CustomTableHeader({ columns }) {
    return (
        <div className="table_header-parent_w">
            {columns.map((column) => (
                <div key={column.id} className="table_header-cell_w">
                    {column.label}
                </div>
            ))}
        </div>
    );
}

export default CustomTableHeader; 
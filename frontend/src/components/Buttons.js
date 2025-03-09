import React from 'react';
import './Buttons.scss';

export const ButtonMediumPrimary = ({label, onClick, icon, disabled = false}) => {
    return (
        <button
            className={`button-medium-primary ${disabled ? 'disabled' : ''}`}
            onClick={disabled ? null : onClick}
            aria-disabled={disabled}
        >
            {label}
            {icon}
        </button>
    );
};

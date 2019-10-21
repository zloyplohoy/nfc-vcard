import React from 'react';

export const Button = (props) => (
    <button
        style={props.style}
        className={props.type === 'primary' ? 'btn btn-primary' : 'btn btn-secondary secondary-button'}
        onClick={props.onClick}
        type="button"
    >
        {props.title}
    </button>
);

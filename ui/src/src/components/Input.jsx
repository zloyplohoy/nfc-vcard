import React from 'react';

export const Input = (props) => (
    <div className="form-group">
        <label htmlFor={props.name} className="form-label">{props.title}</label>
        <input
            className={props.type ? '' : 'form-control'}
            id={props.name}
            name={props.name}
            type={props.type || 'text'}
            value={props.value}
            onChange={props.onChange}
        />
    </div>
);

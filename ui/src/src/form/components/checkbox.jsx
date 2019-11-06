import React from 'react';
import {Checkbox, FormControlLabel} from '@material-ui/core';

export const CustomCheckbox = ({input: {value, onChange}, label, className}) => (
    <FormControlLabel
        className={className}
        control={
            <Checkbox checked={Boolean(value)} onChange={onChange} color="primary" />
        }
        label={label}
    />
);

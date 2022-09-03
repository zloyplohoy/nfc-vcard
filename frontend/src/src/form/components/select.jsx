import React from 'react';
import {MenuItem, Select} from '@material-ui/core';

export const CustomSelect = ({input, items = []}) => (
    <Select
        {...input}
        variant="outlined"
        style={{width: '100%'}}
    >
        {items.map(({value, title}, index) => (
            <MenuItem key={index} value={value}>{title}</MenuItem>
        ))}
    </Select>
);

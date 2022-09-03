import React from 'react';
import {FormHelperText, TextField} from '@material-ui/core';

export const CustomTextField = ({input, label, meta: {touched, error}}) => (
    <>
        <TextField
            label={label}
            error={Boolean(touched && error)}
            fullWidth
            variant="outlined"
            autoComplete="off"
            {...input}
        />
        {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </>
);

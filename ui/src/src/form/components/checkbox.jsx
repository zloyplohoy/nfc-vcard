import React from 'react';
import {Checkbox, FormControlLabel, FormHelperText} from '@material-ui/core';

export const CustomCheckbox = ({
    input: {value, ...rest}, label, className, meta: {touched, error}
}) => (
    <>
        <FormControlLabel
            className={className}
            control={
                <Checkbox checked={Boolean(value)} color="primary" {...rest} />
            }
            label={label}
        />
        {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </>
);

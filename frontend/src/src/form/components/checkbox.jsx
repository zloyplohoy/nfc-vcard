import React from 'react';
import {Checkbox, FormControlLabel, FormHelperText} from '@material-ui/core';

export const CustomCheckbox = ({
    input, label, className, meta: {touched, error}
}) => (
    <>
        <FormControlLabel
            className={className}
            control={
                <Checkbox color="primary" {...input} />
            }
            label={label}
        />
        {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </>
);

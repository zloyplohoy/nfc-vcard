import React from 'react';
import {makeStyles, Snackbar, SnackbarContent} from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
};

const snackbarStyle = makeStyles(theme => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: 'flex',
        alignItems: 'center'
    }
}));

export const CustomSnackbar = props => {
    const classes = snackbarStyle();
    const {
        message, variant, onClose
    } = props;
    const Icon = variantIcon[variant];

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            open
            autoHideDuration={6000}
            onClose={onClose}
        >
            <SnackbarContent
                className={classes[variant]}
                aria-describedby="client-snackbar"
                message={(
                    <span id="client-snackbar" className={classes.message}>
                        <Icon className={`${classes.icon}, ${classes.iconVariant}`} />
                        {message}
                    </span>
                )}
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>
                ]}
            />
        </Snackbar>
    );
};

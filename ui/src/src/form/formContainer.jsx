import React from 'react';
import {connect} from 'react-redux';
import {
    Field, reduxForm, getFormValues, startSubmit, stopSubmit
} from 'redux-form';
import axios from 'axios';
import grey from '@material-ui/core/colors/grey';
import teal from '@material-ui/core/colors/teal';
import {
    Grid,
    Paper,
    Container,
    Button,
    ButtonGroup,
    CircularProgress,
    makeStyles
} from '@material-ui/core';
import validate from './validate';
import {CustomTextField, CustomCheckbox, CustomSnackbar} from './components';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: grey[800]
        },
        palette: {
            secondary: teal[700]
        }
    },
    paper: submitting => ({
        marginTop: theme.spacing(3),
        padding: theme.spacing(3),
        transition: '0.3s',
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
            content: '""',
            display: submitting ? 'block' : 'none',
            width: '100%',
            height: '100%',
            backgroundColor: grey[100],
            opacity: 0.5,
            zIndex: 1,
            position: 'absolute',
            top: 0,
            left: 0
        }
    }),
    container: {
        maxWidth: '630px',
        position: 'relative'
    },
    form: {
        width: '100%' // Fix IE 11 issue.
    },
    checkbox: {
        marginTop: '5px',
        color: grey[600]
    },
    loader: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2
    }
}));

const FormContainer = (props) => {
    const [state, setState] = React.useState({
        open: null
    });

    const {open} = state;

    const {
        reset, submitting, invalid, pristine, values, handleSubmit, startSubmitting, stopSubmitting
    } = props;

    const classes = useStyles(submitting);

    const handleClose = () => {
        setState({open: null});
    };

    const handleCheck = () => {
        startSubmitting();
        axios('/api/v1/vcard')
            .then(() => {
                setState({
                    open: {
                        variant: 'success',
                        message: 'Карта доступна'
                    }
                });
                stopSubmitting();
            })
            .catch((error) => {
                setState({
                    open: {
                        variant: 'error',
                        message: 'Ошибка! Карта не доступна'
                    }
                });
                console.log(error);
                stopSubmitting();
            });
    };

    const post = () => (
        axios.post(
            '/api/v1/vcard',
            values
        )
            .then(() => {
                setState({
                    open: {
                        variant: 'success',
                        message: 'Запись прошла успешно'
                    }
                });
                reset();
            })
            .catch((error) => {
                setState({
                    open: {
                        variant: 'error',
                        message: 'Запись не удалась'
                    }
                });
                console.log(error);
            })
    );

    return (
        <Container
            maxWidth="sm"
            className={classes.container}
        >
            <Paper className={classes.paper}>
                <form onSubmit={handleSubmit(post)} className={classes.form}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Field name="first_name" component={CustomTextField} label="Имя" />
                        </Grid>
                        <Grid item xs={12}>
                            <Field name="last_name" component={CustomTextField} label="Фамилия" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field name="phone_number" component={CustomTextField} label="Номер телефона" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                component={CustomCheckbox}
                                className={classes.checkbox}
                                name="phone_personal"
                                label="Номер телефона личный"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field name="email_address" component={CustomTextField} label="Email" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Field
                                name="email_personal"
                                component={CustomCheckbox}
                                className={classes.checkbox}
                                label="Email личный"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Field name="organization" component={CustomTextField} label="Организация" />
                        </Grid>
                        <Grid item xs={12}>
                            <Field name="position" component={CustomTextField} label="Должность" />
                        </Grid>
                        <Grid item xs={12}>
                            <Field
                                component={CustomCheckbox}
                                className={classes.checkbox}
                                name="policy"
                                label="Ознакомлен с условиями"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonGroup
                                fullWidth
                                aria-label="full width outlined button group"
                            >
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={submitting || invalid}
                                >
                                    Отправить
                                </Button>
                                <Button
                                    color="secondary"
                                    type="button"
                                    disabled={pristine || submitting}
                                    onClick={reset}
                                >
                                    Очистить
                                </Button>
                                <Button
                                    onClick={handleCheck}
                                    disabled={submitting}
                                >
                                    Проверить
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            {submitting && <div className={classes.loader}><CircularProgress /></div>}
            {open && (
                <CustomSnackbar
                    {...open}
                    onClose={handleClose}
                />
            )}
        </Container>
    );
};

export default reduxForm({
    form: 'RegistrationForm',
    validate
})(connect(state => ({
    values: getFormValues('RegistrationForm')(state)
}), {
    startSubmitting: () => startSubmit('RegistrationForm'),
    stopSubmitting: () => stopSubmit('RegistrationForm')
})(FormContainer));

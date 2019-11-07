import React from 'react';
import {connect} from 'react-redux';
import {
    Field, getFormValues, reduxForm, startSubmit, stopSubmit
} from 'redux-form';
import axios from 'axios';
import {green, grey} from '@material-ui/core/colors';
import {
    Button, ButtonGroup, CircularProgress, Container, Grid, Link, makeStyles, Paper
} from '@material-ui/core';
import {
    CustomCheckbox, CustomSnackbar, CustomTextField, CustomSelect
} from './components';
import validate from './validate';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: '#0e1621'
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
    },
    submitButton: {
        color: green[600],
        border: '1px solid rgba(76, 175, 80, 0.5)',
        '&:hover': {
            border: '1px solid #4caf50',
            backgroundColor: 'rgba(76, 175, 80, 0.08)'
        }
    }
}));

const FormContainer = (props) => {
    const {
        reset, submitting, invalid, pristine, values, handleSubmit, stopSubmitting, startSubmitting
    } = props;

    const classes = useStyles(submitting);

    const [open, setOpen] = React.useState(null);
    const [connected, setConnected] = React.useState(false);

    const handleClose = () => {
        setOpen(null);
    };

    const handleCheck = () => {
        startSubmitting();
        axios('/api/v1/vcard')
            .then(() => {
                setOpen({
                    variant: 'success',
                    message: 'Карта доступна'
                });
                setConnected(true);
                stopSubmitting();
            })
            .catch((error) => {
                if (connected) { // если карта была доступна, но пропал
                    setConnected(false);
                }
                setOpen({
                    variant: 'error',
                    message: 'Карта не доступна'
                });
                console.log(error);
                stopSubmitting();
            });
    };

    const handleDelete = () => {
        startSubmitting();
        axios.delete('/api/v1/vcard')
            .then(() => {
                setOpen({
                    variant: 'success',
                    message: 'Содержимое карты удалено'
                });
                stopSubmitting();
            })
            .catch((error) => {
                setOpen({
                    variant: 'error',
                    message: 'Карта не доступна'
                });
                console.log(error);
                stopSubmitting();
            });
    };

    const post = () => (
        axios.post(
            '/api/v1/vcard', {
                ...values,
                phone_personal: Boolean(values.phone_personal),
                email_personal: Boolean(values.email_personal)
            }
        )
            .then(() => {
                setOpen({
                    variant: 'success',
                    message: 'Запись прошла успешно'
                });
                reset();
            })
            .catch((error) => {
                setOpen({
                    variant: 'error',
                    message: 'Запись не удалась'
                });
                console.log(error);
            })
    );

    const Label = (
        <>
            Принимаю условия&nbsp;
            <Link
                component="a"
                href="/custom/privacy_policy.pdf"
                download="Политика конфиденциальности"
            >
                пользовательского соглашения
            </Link>
        </>
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
                        <Grid item xs={12} sm={8}>
                            <Field name="phone_number" component={CustomTextField} label="Номер телефона" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Field
                                component={CustomSelect}
                                name="phone_personal"
                                items={[{value: 1, title: 'Личный'}, {value: 0, title: 'Рабочий'}]}
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Field name="email_address" component={CustomTextField} label="Email" />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Field
                                name="email_personal"
                                component={CustomSelect}
                                items={[{value: 1, title: 'Личный'}, {value: 0, title: 'Рабочий'}]}
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
                                label={Label}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonGroup
                                fullWidth
                                aria-label="full width outlined button group"
                            >
                                <Button
                                    type="submit"
                                    className={classes.submitButton}
                                    disabled={submitting || invalid}
                                >
                                    Записать
                                </Button>
                                <Button
                                    onClick={handleCheck}
                                    className={classes.submitButton}
                                    disabled={submitting}
                                >
                                    Проверить
                                </Button>
                            </ButtonGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <ButtonGroup
                                fullWidth
                                aria-label="full width outlined button group"
                            >
                                <Button
                                    color="secondary"
                                    type="button"
                                    disabled={pristine || submitting}
                                    onClick={reset}
                                >
                                    Очистить форму
                                </Button>
                                <Button
                                    color="secondary"
                                    type="button"
                                    disabled={submitting}
                                    onClick={handleDelete}
                                >
                                    Стереть карту
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
    validate,
    initialValues: {
        phone_number: '+7',
        phone_personal: 1,
        email_personal: 1
    }
})(connect(state => ({
    values: getFormValues('RegistrationForm')(state)
}), {
    startSubmitting: () => startSubmit('RegistrationForm'),
    stopSubmitting: () => stopSubmit('RegistrationForm')
})(FormContainer));

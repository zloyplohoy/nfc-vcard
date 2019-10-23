import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import {Typography} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {green, red, grey} from '@material-ui/core/colors';
import store from './store';
import FormContainer from './formContainer';
import './styles.css';

const theme = createMuiTheme({
    palette: {
        primary: green,
        secondary: red
    }
});

export class Root extends PureComponent {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <Typography variant="h3" align="center" style={{color: grey[50], marginTop: '30px'}}>
                        Создать rfid-карту
                    </Typography>
                    <FormContainer />
                </MuiThemeProvider>
            </Provider>
        );
    }
}

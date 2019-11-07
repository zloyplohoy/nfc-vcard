import React, {PureComponent} from 'react';
import {Provider} from 'react-redux';
import {CssBaseline} from '@material-ui/core';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {red} from '@material-ui/core/colors';
import store from './store';
import FormContainer from './formContainer';
import './styles.css';

const theme = createMuiTheme({
    palette: {
        secondary: red
    }
});

export class Root extends PureComponent {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    <FormContainer />
                </MuiThemeProvider>
            </Provider>
        );
    }
}

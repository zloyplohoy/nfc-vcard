import React, {Component} from 'react';
import FormContainer from './containers/FormContainer';
import logo from '../logo.png';
import './bootstrap.min.css';
import './index.css';

export class Root extends Component {
    render() {
        return (
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="logo d-none d-lg-block">
                        <img src={logo} alt="logo" className="center-block" />
                    </div>
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <h3 className="title">Создать rfid-карту</h3>
                        <FormContainer />
                    </div>
                </div>
            </div>
        );
    }
}

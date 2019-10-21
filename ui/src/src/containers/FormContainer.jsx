import React, {Component} from 'react';
import axios from 'axios';
import {
    Checkbox, Input, Button, InputCheckbox
} from '../components';

const defaultState = {
    first_name: '',
    last_name: '',
    phone_number: '',
    phone_personal: false,
    email_address: '',
    email_personal: false,
    organization: '',
    position: '',
    policy: false
};

class FormContainer extends Component {
    state = defaultState;

    changeValue = name => event => {
        this.setState({[name]: typeof event === 'object' ? event.target.value : event});
    };

    changeCheckboxValue = name => person => {
        this.setState({[name]: person});
    };

    handleClear = () => {
        this.setState(defaultState);
    };

    handleCheck = () => {
        axios('/api/v1/vcard')
            .then(() => {
                console.log('Success');
            })
            .catch((error) => {
                console.log('Fail');
                console.error(error);
            });
    };

    handleSubmit = () => {
        axios.post(
            '/api/v1/vcard',
            {...this.state}
        )
            .then(() => {
                console.log('Success');
                this.handleClear();
            })
            .catch((error) => {
                console.log('Fail');
                console.error(error);
            });
    };

    render() {
        const {
            first_name,
            last_name,
            phone_number,
            phone_personal,
            email_address,
            email_personal,
            organization,
            position,
            policy
        } = this.state;

        return (
            <form className="container-fluid">
                <Input
                    title="Имя"
                    name="first_name"
                    value={first_name}
                    onChange={this.changeValue('first_name')}
                />
                <Input
                    title="Фамилия"
                    name="last_name"
                    value={last_name}
                    onChange={this.changeValue('last_name')}
                />
                <InputCheckbox
                    title="Номер телефона"
                    name="phone_number"
                    checkboxValue={phone_personal}
                    value={phone_number}
                    onChange={this.changeValue('phone_number')}
                    onCheckboxChange={this.changeCheckboxValue('phone_personal')}
                />
                <InputCheckbox
                    title="Email"
                    name="email_address"
                    checkboxValue={email_personal}
                    value={email_address}
                    onChange={this.changeValue('email_address')}
                    onCheckboxChange={this.changeCheckboxValue('email_personal')}
                />
                <Input
                    title="Организация"
                    name="organization"
                    value={organization}
                    onChange={this.changeValue('organization')}
                />
                <Input
                    title="Позиция"
                    name="position"
                    value={position}
                    onChange={this.changeValue('position')}
                />
                <Checkbox
                    title="Ознакомлен с условиями"
                    name="policy"
                    value={policy}
                    onChange={this.changeCheckboxValue('policy')}
                />
                <Button
                    onClick={this.handleSubmit}
                    type="primary"
                    title="Отправить"
                />
                <Button
                    onClick={this.handleClear}
                    type="secondary"
                    title="Очистить"
                />
                <Button
                    onClick={this.handleCheck}
                    type="secondary"
                    title="Check connection"
                />
            </form>
        );
    }
}

export default FormContainer;

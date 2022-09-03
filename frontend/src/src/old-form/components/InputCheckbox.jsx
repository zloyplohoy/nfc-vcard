import React, {Component} from 'react';

export class InputCheckbox extends Component {
    changeCheckboxValue = () => {
        this.props.onCheckboxChange(!this.props.checkboxValue);
    };

    render() {
        const {
            name,
            title,
            type,
            value,
            checkboxValue,
            onChange
        } = this.props;
        return (
            <div className="form-group">
                <label htmlFor={name} className="form-label">{title} | личный?</label>
                <div className="checkbox-custom">
                    <input
                        checked={checkboxValue}
                        type="checkbox"
                        className="checkbox-custom"
                        onChange={this.changeCheckboxValue}
                    />
                </div>
                <input
                    className="form-control"
                    id={name}
                    name={name}
                    type={type || 'text'}
                    value={value}
                    onChange={onChange}
                />
            </div>
        );
    }
}

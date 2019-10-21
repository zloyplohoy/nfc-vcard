import React, {Component} from 'react';

export class Checkbox extends Component {
    changeCheckboxValue = () => {
        this.props.onChange(!this.props.value);
    };

    render() {
        const {
            name,
            title,
            value
        } = this.props;
        return (
            <div className="form-group">
                <label htmlFor={name} className="form-label">{title}</label>
                <div className="checkbox-custom">
                    <input
                        checked={value}
                        type="checkbox"
                        className="checkbox-custom"
                        onChange={this.changeCheckboxValue}
                    />
                </div>
            </div>
        );
    }
}

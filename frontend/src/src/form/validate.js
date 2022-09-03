export default function (values) {
    const errors = {};
    const requiredFields = [
        'first_name',
        'last_name',
        'phone_number',
        'email_address'
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Поле обязательно для заполнения';
        }
    });
    if (
        values.email_address
        && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_address)
    ) {
        errors.email_address = 'Неверный Email адрес';
    }
    if (
        // eslint-disable-next-line no-useless-escape
        values.phone_number && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i.test(values.phone_number)
    ) {
        errors.phone_number = 'Неверный номер телефона';
    }

    if (!values.policy) {
        errors.policy = 'Подтвердите согласие с условиями';
    }

    return errors;
}

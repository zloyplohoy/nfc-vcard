import { Metadata } from '@epam/uui-core';
import { PersonDetails } from './types';

const fullNameRegExp = /^[a-zA-Z\s]+$/;

export const personDetailsSchema = (value: PersonDetails): Metadata<PersonDetails> => ({
    props: {
        personalInfo: {
            props: {
                first_name: {
                    isRequired: true,
                    validators: [
                        (value: string) => [
                            !value && 'Name is required',
                            !fullNameRegExp.exec(value)?.length && 'Name should contain latin alphabet characters!'
                        ],
                    ],
                },
                last_name: {
                    isRequired: true,
                    validators: [
                        (value: string) => [
                            !value && 'Surname is required',
                            !fullNameRegExp.exec(value)?.length && 'Surname should contain latin alphabet characters!'
                        ],
                    ],
                },
                organization: {
                    isRequired: false,
                    validators: [
                        (value: string) => !value ? [] : [!fullNameRegExp.exec(value)?.length && 'Organization should contain only Latin alphabet characters!'],
                    ],
                },
                position: {
                    isRequired: false,
                    validators: [
                        (value: string) => !value ? [] : [!fullNameRegExp.exec(value)?.length && 'Position should contain only Latin alphabet characters!'],
                    ],
                },
                policy: {
                    isRequired: true,
                },
            },
        },
        personContacts: {
            props: {
                phone_number: {
                    // isRequired: true,
                },
                // phone_personal: {
                //     isRequired: true,
                // },
                email_address: {
                    // isRequired: true,
                },
                // email_personal: {
                //     isRequired: true,
                // },
            },
        },
    },
});

import * as React from 'react';
import axios from "axios";
import {
    ILens,
    UuiContexts,
    useUuiContext,
    useForm, FormSaveResponse
} from '@epam/uui-core';
import {
    Checkbox,
    FlexCell,
    FlexRow,
    FlexSpacer,
    LabeledInput,
    RichTextView,
    SuccessNotification,
    Text,
    TextInput,
    Button,
    MultiSwitch, ErrorNotification, Blocker,
} from '@epam/promo';
import type {PersonDetails} from './types';
import {personDetailsSchema} from './validationShema';
import css from './Form.module.scss';

const contactTypesArr = [
    {id: "1", caption: "Personal"},
    {id: "0", caption: "Work"},
];

export const defaultData: PersonDetails = {
    personContacts: {
        phone_number: "",
        phone_personal: "1",
        email_address: "",
        email_personal: "1"
    },
    personalInfo: {
        first_name: "",
        last_name: "",
        organization: "",
        position: "",
        policy: undefined,
    },
};


const Label = (
    <p>I accept&nbsp;<a href="/custom/privacy_policy.pdf" download="Privacy_policy">privacy policy</a></p>
);

const PersonalInfo = ({lens}: { lens: ILens<PersonDetails['personalInfo']> }) => (
    <>
        <RichTextView><h4 className={css.sectionTitle}>Personal Info</h4></RichTextView>
        <FlexRow vPadding='12' spacing='18'>
            <FlexCell minWidth={300}>
                <LabeledInput htmlFor="first_name" label='Name' {...lens.prop('first_name').toProps()}>
                    <TextInput {...lens.prop('first_name').toProps()} id="first_name" placeholder='Ivan'/>
                </LabeledInput>
            </FlexCell>
            <FlexCell minWidth={300}>
                <LabeledInput htmlFor="last_name" label='Surname' {...lens.prop('last_name').toProps()}>
                    <TextInput {...lens.prop('last_name').toProps()} id="last_name" placeholder='Petrov'/>
                </LabeledInput>
            </FlexCell>
        </FlexRow>
        <FlexRow vPadding='12' spacing='18'>
            <FlexCell minWidth={300}>
                <LabeledInput htmlFor="organization" label='Organization' {...lens.prop('organization').toProps()}>
                    <TextInput {...lens.prop('organization').toProps()} id="organization" placeholder='EPAM Systems'/>
                </LabeledInput>
            </FlexCell>
            <FlexCell minWidth={300}>
                <LabeledInput htmlFor="position" label='Position' {...lens.prop('position').toProps()}>
                    <TextInput {...lens.prop('position').toProps()} id="position" placeholder='Developer'/>
                </LabeledInput>
            </FlexCell>
        </FlexRow>
    </>
);

const ContactInfo = ({lens}: { lens: ILens<PersonDetails['personContacts']> }) => {
    return (
        <>
            <RichTextView><h4 className={css.sectionTitle}>Contact Info</h4></RichTextView>
            <FlexRow vPadding='12' spacing='18'>
                <FlexCell minWidth={300}>
                    <LabeledInput htmlFor="p" label='Phone number' {...lens.prop('phone_number').toProps()}>
                        <TextInput {...lens.prop('phone_number').toProps()} id="phone" placeholder='+...'/>
                    </LabeledInput>

                </FlexCell>
                <FlexCell minWidth={250}>
                    <LabeledInput label='Phone Type' {...lens.prop('phone_personal').toProps()} >
                        <MultiSwitch
                            {...lens.prop('phone_personal').toProps()}
                            items={contactTypesArr}
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
            <FlexRow vPadding='12' spacing='18'>
                <FlexCell minWidth={300}>
                    <LabeledInput htmlFor="email" label='Email' {...lens.prop('email_address').toProps()}>
                        <TextInput {...lens.prop('email_address').toProps()} id="email"
                                   placeholder='example@gmail.com'/>
                    </LabeledInput>
                </FlexCell>
                <FlexCell minWidth={250}>
                    <LabeledInput label='Email Type' {...lens.prop('email_personal').toProps()} >
                        <MultiSwitch
                            {...lens.prop('email_personal').toProps()}
                            items={contactTypesArr}
                        />
                    </LabeledInput>
                </FlexCell>
            </FlexRow>
        </>
    )
};

const Policy = ({lens}: { lens: ILens<PersonDetails['personalInfo']> }) => (
    <>
        <FlexRow vPadding='12'>
            <FlexCell width='auto' cx={css.container}>
                <Checkbox {...lens.prop('policy').toProps()} label={Label}/>
            </FlexCell>
        </FlexRow>
    </>
);

export function Form() {
    const svc = useUuiContext<any, UuiContexts>();
    const [value, setValue] = React.useState(defaultData);
    const [isLoading, setLoading] = React.useState(false);

    const handleCheck = async () => {
        setLoading(true);
        axios('/api/v1/vcard')
            .then(() => {
                svc.uuiNotifications.show(props => (
                    <SuccessNotification {...props}>
                        <Text size='36' font='sans' fontSize='14'>Card is available!</Text>
                    </SuccessNotification>), {duration: 2})
                // setConnected(true);
                setLoading(false);
            })
            .catch((error) => {
                // if (connected) { // если карта была доступна, но пропал
                //     setConnected(false);
                // }
                svc.uuiNotifications.show(props => (
                    <ErrorNotification {...props}>
                        <Text size='36' font='sans' fontSize='14'>Card is not available!</Text>
                    </ErrorNotification>), {duration: 5})
                console.log(error);
                setLoading(false);
            });
    };

    const handleDelete = () => {
        setLoading(true);
        axios.delete('/api/v1/vcard')
            .then(() => {
                svc.uuiNotifications.show(props => (
                    <SuccessNotification {...props}>
                        <Text size='36' font='sans' fontSize='14'>Card was erased!</Text>
                    </SuccessNotification>), {duration: 2})
                setLoading(false);
            })
            .catch((error) => {
                svc.uuiNotifications.show(props => (
                    <ErrorNotification {...props}>
                        <Text size='36' font='sans' fontSize='14'>Card is not available!</Text>
                    </ErrorNotification>), {duration: 5})
                console.log(error);
                setLoading(false);
            });
    };

    const post = async (values: PersonDetails): Promise<FormSaveResponse<PersonDetails>> => (
        axios.post(
            '/api/v1/vcard', {
                ...values.personContacts,
                ...values.personalInfo,
                phone_personal: Boolean(values.personContacts.phone_personal),
                email_personal: Boolean(values.personContacts.email_personal)
            }
        ).then(() => ({form: defaultData}))
    );

    const {lens, save, revert, isInProgress} = useForm<PersonDetails>({
        value: value,
        getMetadata: personDetailsSchema,
        onSave: post,
        onSuccess: () => {
            svc.uuiNotifications.show(props =>
                <SuccessNotification {...props}>
                    <Text size='36' font='sans' fontSize='14'>Data has been written!</Text>
                </SuccessNotification>, {duration: 2})
        },
    });

    return (
        <div className={css.root}>
            <FlexCell width='100%'>
                <PersonalInfo lens={lens.prop('personalInfo')}/>
                <ContactInfo lens={lens.prop('personContacts')}/>
                <Policy lens={lens.prop('personalInfo')}/>
                <hr className={css.divider}/>
                <FlexRow spacing='12'>
                    <Button caption='Restore' color='red' onClick={revert}/>
                    <Button caption='Clear card' color='red' onClick={handleDelete}/>
                    <FlexSpacer/>
                    <Button caption='Check' color='green' fill='white' onClick={handleCheck}/>
                    <Button caption='Write' color='green' onClick={save}/>
                </FlexRow>
            </FlexCell>
            {(isLoading || isInProgress) && <Blocker isEnabled={isLoading || isInProgress}/>}
        </div>
    );
}

export interface PersonalInfo {
    first_name: string;
    last_name: string;
    organization: string;
    position: string;
    policy?: boolean;
}

export interface PersonContacts {
    phone_number: string;
    phone_personal: string;
    email_address: string;
    email_personal: string;
}

export interface PersonDetails {
    personalInfo: PersonalInfo;
    personContacts: PersonContacts;
}

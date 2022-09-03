import React from 'react';
import { Panel, RichTextView } from '@epam/promo';
import {Form} from "./Form/Form";
import css from './MainPage.module.scss';

export const MainPage = () => {
    return (
        <>
            <Panel cx={ css.mainPanel } background='white' shadow>
                <RichTextView size="14">
                    <h2 className={css.title}>Fill form to create NFC Card</h2>
                </RichTextView>
                <Form />
            </Panel>
        </>
    );
};

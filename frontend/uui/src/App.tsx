import React from 'react';
import { MainPage } from './pages/MainPage';
import { AppHeader } from './AppHeader';
import css from './App.module.scss';

export const App = () => {
    return (
        <div className={ css.app }>
            <AppHeader />
            <main>
                <MainPage />
            </main>
        </div>
    );
}

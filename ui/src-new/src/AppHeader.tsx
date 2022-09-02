import * as React from "react";
import logo from "./icons/logo.svg";
import { MainMenu, MainMenuButton } from "@epam/promo";

export const AppHeader = () => {
    return (
        <MainMenu appLogoUrl={ logo }>
            <MainMenuButton caption='Create your NFC Card' priority={ 1 } estimatedWidth={ 72 } />
        </MainMenu>
    )
}

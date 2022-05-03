import React from 'react';
import { INavContext } from '../layouts/Navigation';

export default function setOnce(
    setState: (value: React.SetStateAction<INavContext>) => void,
    bc: INavContext
) {
    React.useEffect(() => {
        setState(bc);
    }, []);
}

export function addButtons(
    state: INavContext,
    setState: (value: React.SetStateAction<INavContext>) => void,
    buttons: React.ReactNode[]
) {
    if (state.buttons) {
        setState({
            ...state,
            buttons: [...state.buttons, ...buttons],
        });
    } else {
        setState({
            ...state,
            buttons,
        });
    }
}
export function appendToButtons(
    state: INavContext,
    setState: (value: React.SetStateAction<INavContext>) => void,
    button: React.ReactNode
) {
    addButtons(state, setState, [button]);
}

export function appendToMenu(
    state: INavContext,
    setState: (value: React.SetStateAction<INavContext>) => void,
    menuItems: React.ReactNode[]
) {
    if (state.menu) {
        setState({
            ...state,
            menu: [...state.menu, ...menuItems],
        });
    } else {
        setState({
            ...state,
            menu: [...menuItems],
        });
    }
}

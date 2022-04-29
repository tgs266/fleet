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

export function appendToButtons(
    state: INavContext,
    setState: (value: React.SetStateAction<INavContext>) => void,
    button: React.ReactNode
) {
    setState({
        ...state,
        buttons: [...state.buttons, button],
    });
}

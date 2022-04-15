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

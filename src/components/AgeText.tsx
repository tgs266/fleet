/* eslint-disable react/function-component-definition */
import React from 'react';
import { millisecondsToHumanReadable, millisecondsToOrigination } from '../utils/time';

const AgeText = (props: { value: number; hr?: boolean }) => {
    const [date, setDate] = React.useState(new Date());

    if (props.value < 0) {
        return <>-</>;
    }

    React.useEffect(() => {
        const secondsTimer = setInterval(() => {
            setDate(new Date());
        }, 1000);
        return () => clearInterval(secondsTimer);
    }, []);
    if (props.hr) {
        return <div>{millisecondsToHumanReadable(date.getTime() - props.value)}</div>;
    }
    return <>{millisecondsToOrigination(date.getTime() - props.value).toLocaleString()}</>;
};

export default AgeText;

import { Spinner } from '@blueprintjs/core';
import * as React from 'react';

export default function SpinnerWrapper(props: {
    className?: string;
    value?: number;
    size?: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
}) {
    return (
        <div style={{ position: 'relative', zIndex: 1, ...props.style }}>
            <div
                style={{
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    top: '50%',
                    left: '50%',
                    zIndex: 2,
                }}
            >
                {props.children}
            </div>
            <Spinner className={props.className} size={props.size} value={props.value} />
        </div>
    );
}

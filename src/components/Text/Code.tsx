import React from 'react';
import { ITextProps } from './Text';

export default function Code(props: ITextProps) {
    const classList = ['bp4-ui-text', 'ui-text'];
    if (props.small) {
        classList.push('small');
    }
    if (props.large) {
        classList.push('large');
    }
    if (props.muted) {
        classList.push('muted');
    }
    const classListString = classList.join(' ');
    return (
        <div style={{ ...props.style, fontSize: props.size }} className={classListString}>
            <div
                className="bp4-code-block"
                style={{
                    fontFamily: 'monospace',
                    fontSize: props.fontSize || '14px',
                    alignItems: 'center',
                    whiteSpace: 'break-spaces',
                    ...props.textBlockStyle,
                }}
            >
                {props.children}
            </div>
        </div>
    );
}

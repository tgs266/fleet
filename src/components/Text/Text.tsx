import React from 'react';

export interface ITextProps {
    children: React.ReactNode;
    small?: boolean;
    large?: boolean;
    muted?: boolean;
    size?: number;
    style?: React.CSSProperties;
    code?: boolean;
    codePrefix?: React.ReactNode;
    fontSize?: string;
}

export default function Text(props: ITextProps) {
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
            {!props.code ? (
                props.children
            ) : (
                <pre
                    className="bp4-code-block"
                    style={{
                        overflow: 'auto',
                        fontFamily: 'inherit',
                        fontSize: props.fontSize || '16px',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {props.codePrefix}
                    <code style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                        {props.children}
                    </code>
                </pre>
            )}
        </div>
    );
}

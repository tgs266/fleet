import { Icon, Intent } from '@blueprintjs/core';
import React from 'react';
import Text from './Text';

export interface IAETextProps {
    children: React.ReactNode;
}

export default function ActionEqualText(props: IAETextProps) {
    return (
        <Text
            large
            code
            codePrefix={
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '0.5em' }}>
                    <Icon
                        icon="info-sign"
                        intent={Intent.PRIMARY}
                        style={{ marginRight: '0.5em' }}
                    />
                    This action is identical to:
                </div>
            }
        >
            {props.children}
        </Text>
    );
}

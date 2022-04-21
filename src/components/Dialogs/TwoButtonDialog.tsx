import { Button, Intent } from '@blueprintjs/core';
import * as React from 'react';
import BaseDialog from './BaseDialog';

export default function TwoButtonDialog(props: {
    maxWidth?: 'xs' | 'md' | 'lg' | 'xl' | string;
    title: string;
    id?: string;
    children: React.ReactNode;
    successText?: string;
    failureText?: string;
    onSuccess: () => void;
    onFailure: () => void;
    isOpen: boolean;
}) {
    const { maxWidth, title, children, onSuccess, onFailure, successText, failureText, isOpen } =
        props;
    return (
        <BaseDialog
            id={props.id}
            isOpen={isOpen}
            onClose={onFailure}
            title={title}
            maxWidth={maxWidth}
        >
            {children}
            <div style={{ marginTop: '1em', display: 'flex' }}>
                <div style={{ flexGrow: 1 }} />
                <Button style={{ marginRight: '0.5em' }} onClick={onFailure}>
                    {failureText || 'Cancel'}
                </Button>
                <Button onClick={onSuccess} id="success-btn" intent={Intent.PRIMARY}>
                    {successText || 'Ok'}
                </Button>
            </div>
        </BaseDialog>
    );
}

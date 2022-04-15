import { Dialog } from '@blueprintjs/core';
import { DIALOG_BODY } from '@blueprintjs/core/lib/esm/common/classes';
import * as React from 'react';

export default function BaseDialog(props: {
    maxWidth?: 'xs' | 'md' | 'lg' | 'xl' | string;
    title?: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}) {
    const { title, children, isOpen } = props;
    let { maxWidth } = props;
    if (maxWidth === 'xs') {
        maxWidth = '15%';
    } else if (maxWidth === 'sm') {
        maxWidth = '35%';
    } else if (maxWidth === 'md') {
        maxWidth = '50%';
    } else if (maxWidth === 'lg') {
        maxWidth = '75%';
    } else if (maxWidth === 'xl') {
        maxWidth = '90%';
    }
    return (
        <Dialog
            style={{ zIndex: 100000000, maxWidth, width: maxWidth, paddingBottom: 0 }}
            title={title}
            isOpen={isOpen}
            onClose={props.onClose}
        >
            <div className={DIALOG_BODY}>{children}</div>
        </Dialog>
    );
}

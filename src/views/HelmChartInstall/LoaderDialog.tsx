import React from 'react';
import { Dialog, Intent, Spinner } from '@blueprintjs/core';
import Text from '../../components/Text/Text';

export default function LoaderDialog(props: { isOpen: boolean; text?: string }) {
    return (
        <Dialog
            style={{ padding: '3em' }}
            isOpen={props.isOpen}
            onClose={() => {}}
            canEscapeKeyClose={false}
            canOutsideClickClose={false}
        >
            <Spinner size={100} intent={Intent.PRIMARY} />
            {props.text && (
                <div
                    style={{
                        marginTop: '1em',
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Text muted>{props.text}</Text>
                </div>
            )}
        </Dialog>
    );
}

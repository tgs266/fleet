/* eslint-disable indent */
import * as React from 'react';
import { Dialog, Classes, Button, Intent } from '@blueprintjs/core';
import { ContainerSpec } from '../../models/container.model';
import LabelInputGroup from '../LabelInputGroup';

export default function ContainerSpecUpdateDialog(props: {
    spec: ContainerSpec;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (spec: ContainerSpec) => void;
}) {
    const nameRef = React.useRef<HTMLInputElement>();
    // const imageRef = React.useRef<HTMLInputElement>()

    return (
        <Dialog
            isOpen={props.isOpen}
            onClose={props.onClose}
            title="Update Basic Container Spec Details"
        >
            <div className={Classes.DIALOG_BODY}>
                <LabelInputGroup
                    inputRef={nameRef}
                    label="Name"
                    defaultValue={props.spec.name}
                    fill
                />
                {/* <LabelInputGroup inputRef={imageRef} label="Image" defaultValue={props.spec.image} fill /> */}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
                <div style={{ float: 'right' }}>
                    <Button
                        intent={Intent.NONE}
                        text="Cancel"
                        style={{ marginRight: '0.5em' }}
                        onClick={props.onClose}
                    />
                    <Button
                        intent={Intent.PRIMARY}
                        text="Save"
                        onClick={() => {
                            const newImg = { ...props.spec };
                            // newImg.image.name = imageRef.current.value
                            newImg.name = nameRef.current.value;
                            props.onSuccess(newImg);
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
}

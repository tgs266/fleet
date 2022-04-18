/* eslint-disable indent */
import * as React from 'react';
import { Dialog, Classes, Button, Intent } from '@blueprintjs/core';
import LabelInputGroup from '../../components/LabelInputGroup';
import K8 from '../../services/k8.service';

export default function DeploymentScaleDialog(props: {
    name: string;
    namespace: string;
    replicas: number;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const scaleRef = React.useRef<HTMLInputElement>();

    return (
        <Dialog isOpen={props.isOpen} onClose={props.onClose} title="Scale">
            <div className={Classes.DIALOG_BODY}>
                <LabelInputGroup
                    type="number"
                    min={0}
                    max={10}
                    inputRef={scaleRef}
                    label="Replicas"
                    defaultValue={props.replicas.toString()}
                    fill
                />
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
                            K8.deployments
                                .scale(
                                    props.name,
                                    props.namespace,
                                    parseInt(scaleRef.current.value, 10)
                                )
                                .then(() => {
                                    props.onSuccess();
                                });
                        }}
                    />
                </div>
            </div>
        </Dialog>
    );
}

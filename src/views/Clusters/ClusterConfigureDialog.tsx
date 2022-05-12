import React from 'react';
import { Dialog, InputGroup } from '@blueprintjs/core';
import Label from '../../components/Label';

export default function ClusterConfigureDialog(props: { open: boolean; onClose: () => void }) {
    return (
        <Dialog
            title="Add New Cluster"
            style={{ padding: 0 }}
            isOpen={props.open}
            onClose={props.onClose}
        >
            <div style={{ padding: '20px' }}>
                <Label small={false} label="Cluster Address">
                    <InputGroup fill placeholder="<http(s)>://<hostname>:<port>" />
                </Label>
            </div>
        </Dialog>
    );
}

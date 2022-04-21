import { Card } from '@blueprintjs/core';
import * as YAML from 'yaml';
import * as React from 'react';
import ActionEqualText from '../Text/ActionEqualText';
import JSONTextEditor from '../TextEditor/JSON';
import TwoButtonDialog from './TwoButtonDialog';
import { JSONObject } from '../../models/json.model';

export default function TextEditDialog(props: {
    equiv: string;
    isOpen: boolean;
    onSave: (value: any) => void;
    onClose: () => void;
    initialValue: JSONObject;
}) {
    const { onSave, equiv, isOpen } = props;
    const [value, setValue] = React.useState(YAML.stringify(props.initialValue, null, 2));

    React.useEffect(() => {
        setValue(YAML.stringify(props.initialValue, null, 2));
    }, [props.initialValue]);

    return (
        <TwoButtonDialog
            data-testid="edit-dialog"
            id="edit-dialog"
            maxWidth="md"
            title="Edit"
            isOpen={isOpen}
            onFailure={props.onClose}
            onSuccess={() => {
                onSave(YAML.parse(value));
            }}
            successText="Save"
            failureText="Cancel"
        >
            <Card
                id="edit-dialog"
                style={{ width: '100%', height: '25em', marginBottom: '1em', padding: 0 }}
            >
                <JSONTextEditor value={value} onChange={setValue} />
            </Card>
            {/* {error && <Callout intent="danger">
            {error}
        </Callout>} */}
            {equiv && (
                <div style={{ marginBottom: '1em' }}>
                    <ActionEqualText>{equiv}</ActionEqualText>
                </div>
            )}
        </TwoButtonDialog>
    );
}

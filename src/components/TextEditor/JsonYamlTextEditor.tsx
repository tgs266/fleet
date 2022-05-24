/* eslint-disable no-restricted-syntax */
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';

export default function JsonYamlTextEditor(props: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <MonacoEditor
            width="100%"
            height="100%"
            language="yaml"
            theme="vs-light"
            value={props.value}
            options={{
                selectOnLineNumbers: true,
            }}
            onChange={props.onChange}
        />
    );
}

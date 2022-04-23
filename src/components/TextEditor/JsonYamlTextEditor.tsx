/* eslint-disable no-restricted-syntax */
import * as React from 'react';

import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-min-noconflict/ext-searchbox';

export default function JsonYamlTextEditor(props: {
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <AceEditor
            style={{
                width: '100%',
                height: '100%',
            }}
            mode="yaml"
            theme="textmate"
            value={props.value}
            onChange={props.onChange}
            name="json-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                tabSize: 2,
                wrap: true,
                fontSize: 14,
                showPrintMargin: false,
                // enableBasicAutocompletion: true,
                // enableLiveAutocompletion: true,
                // enableSnippets: true,
            }}
        />
    );
}

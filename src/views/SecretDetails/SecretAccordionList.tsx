/* eslint-disable no-plusplus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable indent */
import * as React from 'react';
import { Card } from '@blueprintjs/core';
import { JSONObjectType } from '../../models/json.model';
import Accordion from '../../components/Accordion';
import Code from '../../components/Text/Code';

function base64ToArrayBuffer(base64: string) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Int8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export default function SecretAccordionList(props: {
    data: JSONObjectType<string>;
    style?: React.CSSProperties;
}) {
    const { data, style } = props;
    const enc = new TextDecoder('utf-8');

    return (
        <div style={style}>
            <Card style={{ borderRadius: '3px 3px 0px 0px' }}>
                <div style={{ display: 'flex' }}>
                    <h3 style={{ margin: 0 }}>Secrets</h3>
                </div>
            </Card>
            {Object.keys(data).map((key) => (
                <Accordion
                    iconClosed="eye-open"
                    iconOpen="eye-off"
                    key={key}
                    className="rule-accordion-list-child"
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {key}
                            <div style={{ flexGrow: 1 }} />
                            <div style={{ marginRight: '1em' }}>
                                {base64ToArrayBuffer(data[key]).byteLength - 1} Bytes
                            </div>
                        </div>
                    }
                >
                    <div style={{ margin: '5px 0' }}>
                        <Code textBlockStyle={{ backgroundColor: '#DCE0E5' }}>
                            {enc.decode(base64ToArrayBuffer(data[key]))}
                        </Code>
                    </div>
                </Accordion>
            ))}
        </div>
    );
}

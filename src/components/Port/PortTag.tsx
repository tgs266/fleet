/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
import * as React from 'react';
import { Intent, Tag } from '@blueprintjs/core';
import Text from '../Text/Text';
import { Port } from '../../models/container.model';

export default function PortTag(props: {
    port: Port;
    style?: React.CSSProperties;
    fontSize?: number;
}) {
    const { port } = props;

    function getIntent(protocol: string) {
        let intent;
        switch (protocol) {
            case 'TCP':
                intent = Intent.PRIMARY;
                break;
            case 'UDP':
                intent = Intent.SUCCESS;
                break;
            case 'SCTP':
                intent = Intent.WARNING;
                break;
            default:
                intent = Intent.NONE;
        }
        return intent;
    }

    const selectedIntent = getIntent(port.protocol);
    const hostPort = port.hostPort === 0 ? '' : port.hostPort;
    const hostIp = port.hostIp !== '' ? `${port.hostIp}:${hostPort}` : hostPort;
    return (
        <Tag style={props.style} minimal round intent={selectedIntent as Intent}>
            <Text size={props.fontSize}>
                {port.containerPort}:{hostIp} {port.protocol}
            </Text>
        </Tag>
    );
}

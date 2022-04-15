/* eslint-disable no-restricted-syntax */
/* eslint-disable indent */
import * as React from 'react';
import PortTag from './PortTag';
import { Port } from '../../models/container.model';

export default function PortTags(props: { ports: Port[] }) {
    const { ports } = props;
    if (!ports || ports.length === 0) {
        return null;
    }
    return (
        <>
            {ports.map((port) => (
                <PortTag port={port} />
            ))}
        </>
    );
}

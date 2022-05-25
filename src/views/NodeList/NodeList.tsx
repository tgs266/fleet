import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import NodeTable from './NodeTable';

export default function NodeList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'Nodes',
            },
        ],
    });
    return (
        <div style={{ margin: '1em' }}>
            <NodeTable />
        </div>
    );
}

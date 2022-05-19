import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import ReplicaSetTable from './ReplicaSetTable';

export default function ServiceList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'replica sets',
            },
        ],
        buttons: [],
        menu: null,
    });
    return (
        <div style={{ margin: '1em' }}>
            <ReplicaSetTable hotkeys namespace="_all_" />
        </div>
    );
}

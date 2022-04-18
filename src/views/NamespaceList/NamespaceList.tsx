import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import NamespaceTable from './NamespaceTable';

export default function NamespaceList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'namespaces',
            },
        ],
        buttons: [],
        menu: null,
    });
    return (
        <div style={{ margin: '1em' }}>
            <NamespaceTable />
        </div>
    );
}

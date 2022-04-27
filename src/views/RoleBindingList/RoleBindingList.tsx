import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import RoleTable from './RoleBindingTable';

export default function RoleBindingList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'role bindings',
            },
        ],
        buttons: [],
        menu: null,
    });
    return (
        <div style={{ margin: '1em' }}>
            <RoleTable />
        </div>
    );
}

import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import ClusterRoleBindingTable from './ClusterRoleBindingTable';

export default function ClusterRoleBindingList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'Cluster Role Bindings',
            },
        ],
        buttons: [],
        menu: null,
    });
    return (
        <div style={{ margin: '1em' }}>
            <ClusterRoleBindingTable />
        </div>
    );
}

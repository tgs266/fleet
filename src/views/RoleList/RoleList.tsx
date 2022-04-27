import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import ClusterRoleTable from '../ClusterRoleList/ClusterRoleTable';
import RoleTable from './RoleTable';

export default function RoleList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'roles',
            },
        ],
        buttons: [],
        menu: null,
    });
    return (
        <div style={{ margin: '1em' }}>
            <RoleTable />
            <div style={{ marginTop: '1em' }}>
                <ClusterRoleTable />
            </div>
        </div>
    );
}

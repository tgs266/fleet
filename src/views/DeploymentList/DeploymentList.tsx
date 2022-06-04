import { Button } from '@blueprintjs/core';
import * as React from 'react';
import Link from '../../layouts/Link';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import DeploymentTable from './DeploymentTable';

export default function DeploymentList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'Deployments',
            },
        ],
        buttons: [
            <Link key="add" to="/create-deployment">
                <Button icon="add" />
            </Link>,
        ],
    });
    return (
        <div style={{ margin: '1em' }}>
            <DeploymentTable hotkeys />
        </div>
    );
}

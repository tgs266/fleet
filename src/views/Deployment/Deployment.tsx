import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import DeploymentTable from './DeploymentTable';

export default function Deployments() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'deployments',
            },
        ],
        buttons: [
            <Link to="/create-deployment">
                <Button icon="add" />
            </Link>,
        ],
    });
    return (
        <div style={{ margin: '1em' }}>
            <DeploymentTable />
        </div>
    );
}

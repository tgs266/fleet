import * as React from 'react';
import { useParams } from 'react-router';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import DeploymentTable from '../DeploymentList/DeploymentTable';
import PodListTable from '../PodList/PodListTable';

export default function Namespace() {
    const params = useParams();
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'namespaces',
            },
            {
                text: params.namespace,
            },
        ],
        buttons: [],
        menu: null,
    });
    return (
        <div>
            <div style={{ margin: '1em' }}>
                <DeploymentTable namespace={params.namespace} />
            </div>
            <div style={{ margin: '1em' }}>
                <PodListTable namespace={params.namespace} />
            </div>
        </div>
    );
}

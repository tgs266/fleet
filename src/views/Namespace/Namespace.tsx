import * as React from 'react';
import { useParams } from 'react-router';
import Text from '../../components/Text/Text';
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
                <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                    Deployments
                </Text>
                <DeploymentTable namespace={params.namespace} />
            </div>
            <div style={{ margin: '1em' }}>
                <Text muted style={{ marginBottom: '0.25em', marginLeft: '0.25em' }}>
                    Pods
                </Text>
                <PodListTable namespace={params.namespace} />
            </div>
        </div>
    );
}

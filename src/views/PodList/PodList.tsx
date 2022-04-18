import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import PodListTable from './PodListTable';

export default function PodList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'pods',
            },
        ],
    });
    return (
        <div style={{ margin: '1em' }}>
            <PodListTable />
        </div>
    );
}

import * as React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import setOnce from '../../utils/breadcrumbs';
import HelmReleaseTable from './HelmReleaseTable';

export default function HelmReleaseList() {
    const [, setState] = useNavContext();
    setOnce(setState, {
        breadcrumbs: [
            {
                text: 'Helm Releases',
                link: '/helm/releases',
            },
        ],
        buttons: [],
        menu: null,
    });
    return <HelmReleaseTable />;
}

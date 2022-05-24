import React from 'react';
import { useNavContext } from '../../layouts/Navigation';
import HelmChartTable from './HelmChartTable';

export default function HelmSearch() {
    const [, setState] = useNavContext();

    React.useEffect(() => {
        setState({
            breadcrumbs: [
                {
                    text: 'Helm Charts',
                },
            ],
            menu: null,
            buttons: [],
        });
    }, []);

    return (
        <div style={{ margin: '1em' }}>
            <HelmChartTable />
        </div>
    );
}

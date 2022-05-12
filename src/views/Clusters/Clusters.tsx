/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { useNavigate } from 'react-router';
import { Alignment, Button, Card } from '@blueprintjs/core';
import { useNavContext } from '../../layouts/Navigation';
import Electron from '../../services/electron.service';
import { ElectronCluster } from '../../models/cluster.model';
import TitledCard from '../../components/Cards/TitledCard';
import ResourceTable from '../../components/ResourceTable';

export default function Clusters() {
    const [, setState] = useNavContext();
    React.useEffect(
        () =>
            setState({
                breadcrumbs: [
                    {
                        text: 'clusters',
                    },
                ],
                buttons: [],
                menu: null,
            }),
        []
    );

    const [clusters, setClusters] = React.useState<ElectronCluster[]>([]);
    const nav = useNavigate();

    if (!Electron.isElectron) {
        return <div>NOT ELECTRON</div>;
    }

    React.useEffect(() => {
        Electron.getClusters().then((r) => {
            setClusters(r.data);
        });
    }, []);

    return (
        <TitledCard title="Clusters" style={{ margin: '1em' }}>
            <Card style={{ padding: 0 }}>
                <ResourceTable<ElectronCluster>
                    data={clusters}
                    keyPath="cluster"
                    columns={[
                        {
                            columnName: 'Cluster',
                            key: 'cluster',
                            columnFunction: (row: ElectronCluster) => row.cluster,
                        },
                        {
                            columnName: 'User',
                            key: 'user',
                            columnFunction: (row: ElectronCluster) => row.user,
                        },
                        {
                            columnName: 'Namespace',
                            key: 'namespace',
                            columnFunction: (row: ElectronCluster) => row.namespace,
                        },
                        {
                            columnName: '',
                            key: 'connect',
                            alignment: Alignment.RIGHT,
                            columnFunction: (row: ElectronCluster) => (
                                <Button
                                    icon="link"
                                    onClick={() => {
                                        Electron.connectToCluster(row).then((r) => {
                                            window.localStorage.setItem('jwe', r.data.token);
                                            nav('/');
                                        });
                                    }}
                                />
                            ),
                        },
                    ]}
                />
            </Card>
        </TitledCard>
    );
}

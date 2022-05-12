/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { useNavigate } from 'react-router';
import { Alignment, Button, Card, Intent, Tag } from '@blueprintjs/core';
import { useNavContext } from '../../layouts/Navigation';
import Electron from '../../services/electron.service';
import { ElectronCluster } from '../../models/cluster.model';
import ResourceTable from '../../components/ResourceTable';
import Toaster from '../../services/toast.service';
import ClusterConfigureDialog from './ClusterConfigureDialog';

export default function Clusters() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const [, setState] = useNavContext();
    React.useEffect(
        () =>
            setState({
                breadcrumbs: [
                    {
                        text: 'clusters',
                    },
                ],
                buttons: [
                    <Button onClick={() => setIsDialogOpen(true)} intent={Intent.PRIMARY}>
                        Configure New Cluster
                    </Button>,
                ],
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
            if (r.data.length === 0) {
                Toaster.show({
                    intent: Intent.WARNING,
                    message:
                        'Could not detect any kubernetes clusters in your kubeconfig file. Please add one',
                });
            }
            setClusters(r.data);
        });
    }, []);

    return (
        <>
            <ClusterConfigureDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
            <Card style={{ padding: 0, margin: '1em' }}>
                <ResourceTable<ElectronCluster>
                    data={clusters}
                    keyPath="cluster"
                    columns={[
                        {
                            columnName: 'Cluster',
                            key: 'cluster',
                            columnFunction: (row: ElectronCluster) => row.name,
                        },
                        {
                            columnName: 'Source',
                            key: 'source',
                            columnFunction: (row: ElectronCluster) => row.source,
                        },
                        {
                            columnName: 'Connected',
                            key: 'isConnected',
                            columnFunction: (row: ElectronCluster) => {
                                if (row.isConnected) {
                                    return (
                                        <Tag round intent={Intent.SUCCESS}>
                                            True
                                        </Tag>
                                    );
                                }
                                return (
                                    <Tag round intent={Intent.DANGER}>
                                        False
                                    </Tag>
                                );
                            },
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
        </>
    );
}

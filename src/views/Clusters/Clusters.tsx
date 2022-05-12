/* eslint-disable react/no-unstable-nested-components */
import * as React from 'react';
import { Alignment, ButtonGroup, Button, Card, Intent, Tag } from '@blueprintjs/core';
import { useNavContext } from '../../layouts/Navigation';
import Electron from '../../services/electron.service';
import { ElectronCluster } from '../../models/cluster.model';
import ResourceTable from '../../components/ResourceTable';
import Toaster from '../../services/toast.service';
import ClusterConfigureDialog from './ClusterConfigureDialog';
import { useAuthContext } from '../../contexts/AuthContext';
import Auth from '../../services/auth.service';

export default function Clusters() {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const [, setState] = useNavContext();
    const [authCtx, setAuthCtx] = useAuthContext();
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

    if (!Electron.isElectron) {
        return <div>NOT ELECTRON</div>;
    }

    const getData = () => {
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
        Electron.getCurrentCluster()
            .then((r) => {
                sessionStorage.setItem('path', `http://localhost:${r.data.port}`);
                Auth.using()
                    .then((r2) => {
                        Auth.whoami()
                            .then((r3) => {
                                setAuthCtx({
                                    cluster: r.data,
                                    useAuth: r2.data.usingAuth,
                                    username: r3.data.username,
                                });
                            })
                            .catch(() => {
                                setAuthCtx({
                                    cluster: r.data,
                                    useAuth: r2.data.usingAuth,
                                    username: null,
                                });
                            });
                    })
                    .catch(() => {
                        setAuthCtx({
                            cluster: r.data,
                            useAuth: null,
                            username: null,
                        });
                    });
            })
            .catch(() => {
                setAuthCtx({ cluster: null, useAuth: null, username: null });
            });
    };

    React.useEffect(() => {
        getData();
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
                            columnName: 'In Use',
                            key: 'inUse',
                            columnFunction: (row: ElectronCluster) => {
                                if (authCtx.cluster && row.name === authCtx.cluster.name) {
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
                            columnFunction: (row: ElectronCluster) => {
                                const using = authCtx.cluster && row.name === authCtx.cluster.name;
                                return (
                                    <ButtonGroup>
                                        <Button
                                            intent={
                                                row.isConnected ? Intent.DANGER : Intent.SUCCESS
                                            }
                                            onClick={() => {
                                                if (!row.isConnected) {
                                                    Electron.connectToCluster(row).then((r) => {
                                                        window.localStorage.setItem(
                                                            'jwe',
                                                            r.data.token
                                                        );
                                                        getData();
                                                    });
                                                } else {
                                                    Electron.disconnectFromCluster(row.name).then(
                                                        () => {
                                                            getData();
                                                        }
                                                    );
                                                }
                                            }}
                                        >
                                            {row.isConnected ? 'Disconnect' : 'Connect'}
                                        </Button>
                                        <Button
                                            intent={using ? Intent.DANGER : Intent.SUCCESS}
                                            onClick={() => {
                                                if (using) {
                                                    Electron.stop(row).then(() => {
                                                        getData();
                                                    });
                                                } else {
                                                    Electron.start(row).then(() => {
                                                        getData();
                                                    });
                                                }
                                            }}
                                            disabled={!row.isConnected}
                                        >
                                            {using ? 'Stop' : 'Start'}
                                        </Button>
                                    </ButtonGroup>
                                );
                            },
                        },
                    ]}
                />
            </Card>
        </>
    );
}
